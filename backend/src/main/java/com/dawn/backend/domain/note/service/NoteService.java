package com.dawn.backend.domain.note.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.response.CreateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.note.entity.UserNoteCheck;
import com.dawn.backend.domain.note.repository.ImageRepository;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.repository.PinRepository;
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

	private void validatePermission(Long userId, Long noteId) {
		Note note = getNoteById(noteId);
		Long projectId = note.getBlueprintVersion().getBlueprint().getProject().getProjectId();

		userProjectRepository.findByUserIdAndProjectId(userId, projectId)
				.orElseThrow(() -> new RuntimeException("User does not have permission to delete this note."));
	}

	public Note getNoteById(Long noteId) {
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

		List<User> projectUsers = userProjectRepository.findUsersByProjectId(createNoteRequestDto.projectId());

		projectUsers.stream()
				.filter(projectUser -> !projectUser.equals(user))
				.map(projectUser -> UserNoteCheck.builder()
						.note(note)
						.user(projectUser)
						.build())
				.forEach(noteCheckRepository::save);

		return new CreateNoteResponseDto(note.getNoteId());
	}
}
