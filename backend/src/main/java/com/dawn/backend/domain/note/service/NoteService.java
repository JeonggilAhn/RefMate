package com.dawn.backend.domain.note.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.dto.request.BookmarkNoteRequestDto;
import com.dawn.backend.domain.note.dto.NoteItem;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.UpdateNoteRequestDto;
import com.dawn.backend.domain.note.dto.response.BookmarkNoteResponseDto;
import com.dawn.backend.domain.note.dto.request.GetNotesByPinRequestDto;
import com.dawn.backend.domain.note.dto.response.CreateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.UpdateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByPinResponseDto;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.note.entity.UserNoteCheck;
import com.dawn.backend.domain.note.repository.ImageRepository;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.repository.PinRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class NoteService {

	private final NoteRepository noteRepository;
	private final UserProjectRepository userProjectRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;
	private final PinRepository pinRepository;
	private final ImageRepository imageRepository;
	private final NoteCheckRepository noteCheckRepository;
	private final UserRepository userRepository;

	/**
	 * 일정 시간마다 note.isDeleted = true 인 노트 삭제 로직 필요
	 */
	@Transactional
	public DeleteNoteResponseDto deleteNote(Long noteId) {
//		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//		validatePermission(user.getUserId(), noteId);

		Note note = getNoteById(noteId);
		note.deleteNote();

		return new DeleteNoteResponseDto(noteId);
	}

	@Transactional
	public UpdateNoteResponseDto updateNote(Long noteId, UpdateNoteRequestDto dto) {
		Note note = getNoteById(noteId);

//		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//		validatePermission(user.getUserId(), noteId);

//		validateNoteCreateTime(note);
//		validateIsNoteDeleted(note.getIsDeleted());

		note.updateNoteTitle(dto.noteTitle());
		note.updateNoteContent(dto.noteContent());

		return new UpdateNoteResponseDto(note.getNoteId());

	}

	@Transactional
	public BookmarkNoteResponseDto updateBookmarkNote(Long noteId, BookmarkNoteRequestDto dto) {
		Note note = getNoteById(noteId);
//		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//		validatePermission(user.getUserId(), noteId);

		updateBookmark(note);

		return BookmarkNoteResponseDto.from(note);
	}

	private void updateBookmark(Note note) {
		boolean bookmarked = note.getBookmark();
		if (bookmarked) {
			note.removeBookmark();
		} else {
			note.addBookmark();
		}
	}

	private void validateIsNoteDeleted(Boolean isDeleted) {
		if (isDeleted) {
			throw new RuntimeException("삭제된 노트입니다.");
		}
	}

	private void validateNoteCreateTime(Note note) {
		if (note.getCreatedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
			throw new RuntimeException("5분 이후에는 노트를 수정할 수 없습니다.");
		}
	}


	private void validatePermission(Long userId, Long noteId) {
		Note note = getNoteById(noteId);
		Long projectId = note.getBlueprintVersion().getBlueprint().getProject().getProjectId();

		userProjectRepository.findByUserIdAndProjectId(userId, projectId)
				.orElseThrow(() -> new RuntimeException("User does not have permission to delete this note."));
	}

	private Note getNoteById(Long noteId) {
		return noteRepository.findById(noteId)
				.orElseThrow(() -> new RuntimeException("Note not found with id " + noteId));
	}

	@Transactional
	public CreateNoteResponseDto createNote(Long userId, Long pinId, CreateNoteRequestDto createNoteRequestDto) {

//		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

		BlueprintVersion blueprintVersion
				= blueprintVersionRepository.findById(createNoteRequestDto.blueprintVersionId())
				.orElseThrow(() -> new IllegalArgumentException("해당 블루프린트 버전이 존재하지 않습니다."));

		Pin pin = pinRepository.findById(pinId).orElseThrow(() -> new IllegalArgumentException("해당 핀이 존재하지 않습니다."));

		Note note = Note.builder()
				.noteTitle(createNoteRequestDto.noteTitle())
				.user(user)
				.noteContent(createNoteRequestDto.noteContent())
				.blueprintVersion(blueprintVersion)
				.pin(pin)
				.build();

		noteRepository.save(note);

		if (createNoteRequestDto.imageUrlList() != null) {
			for (String imageUrl : createNoteRequestDto.imageUrlList()) {
				NoteImage noteImage = NoteImage.builder()
						.imageOrigin(imageUrl)
						.imagePreview(imageUrl)
						.note(note)
						.build();
				imageRepository.save(noteImage);
			}
		}

		UserNoteCheck creatorNoteCheck = UserNoteCheck.builder()
				.note(note)
				.user(user)
				.build();
		creatorNoteCheck.updateNoteCheck(true);
		noteCheckRepository.save(creatorNoteCheck);

		List<User> projectUsers = userProjectRepository.findUserByProjectProjectId(createNoteRequestDto.projectId());

		projectUsers.stream()
				.filter(projectUser -> !projectUser.equals(user))
				.map(projectUser -> UserNoteCheck.builder()
						.note(note)
						.user(projectUser)
						.build())
				.forEach(noteCheckRepository::save);

		return new CreateNoteResponseDto(note.getNoteId());
	}

	public GetNotesByPinResponseDto getNotesByPin(Long pinId, GetNotesByPinRequestDto getNotesByPinRequestDto) {
		Pin pin = pinRepository.findById(pinId)
				.orElseThrow(() -> new IllegalArgumentException("해당 핀이 존재하지 않습니다."));

		List<Note> notes = noteRepository.findAllByPinPinId(pinId);

		List<NoteItem> noteItems = notes.stream()
				.map(note -> {

					// TODO: 작성자 정보: join해서 userRole도 가져오기
					ProjectUserDto noteWriter =
							userRepository.findUserWithRoleByUserIdAndProjectId(
									note.getUser().getUserId(),
									getNotesByPinRequestDto.projectId());
					// TODO: 이미지 존재 여부 확인
					boolean isPresentImage = imageRepository.existsByNoteNoteId(note.getNoteId());

					// TODO: 노트를 읽은 사용자 목록 가져오기
					List<ProjectUserDto> readUsers = userRepository.findCheckedUsersWithRolesByNoteId(note.getNoteId());

					return new NoteItem(
							note.getNoteId(),
							noteWriter,
							note.getNoteTitle(),
							note.getBookmark(),
							note.getCreatedAt(),
							isPresentImage,
							readUsers
					);
				}).collect(Collectors.toList());

		return new GetNotesByPinResponseDto(noteItems);
	}
}
