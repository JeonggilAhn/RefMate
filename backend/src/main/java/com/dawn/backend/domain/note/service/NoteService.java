package com.dawn.backend.domain.note.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintNotFoundException;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.dto.BookmarkNoteItem;
import com.dawn.backend.domain.note.dto.ChatItemDto;
import com.dawn.backend.domain.note.dto.DateSeparatorDto;
import com.dawn.backend.domain.note.dto.NoteDto;
import com.dawn.backend.domain.note.dto.NoteItem;
import com.dawn.backend.domain.note.dto.NoteItemWithTypeDto;
import com.dawn.backend.domain.note.dto.request.BookmarkImageRequestDto;
import com.dawn.backend.domain.note.dto.request.BookmarkNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.GetBookmarkNotesRequestDto;
import com.dawn.backend.domain.note.dto.request.GetNotesByBlueprintRequestDto;
import com.dawn.backend.domain.note.dto.request.GetNotesByPinRequestDto;
import com.dawn.backend.domain.note.dto.request.UpdateNoteRequestDto;
import com.dawn.backend.domain.note.dto.response.BookmarkImageResponseDto;
import com.dawn.backend.domain.note.dto.response.BookmarkNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.CreateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.GetBookmarkNotesResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByBlueprintResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByPinResponseDto;
import com.dawn.backend.domain.note.dto.response.NoteDetailResponseDto;
import com.dawn.backend.domain.note.dto.response.RecentNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.UpdateNoteResponseDto;
import com.dawn.backend.domain.note.entity.EditableNote;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.note.entity.UserNoteCheck;
import com.dawn.backend.domain.note.exception.DeletedNoteException;
import com.dawn.backend.domain.note.exception.ImageNotFoundException;
import com.dawn.backend.domain.note.exception.NoteByBlueprintVersionNotFound;
import com.dawn.backend.domain.note.exception.NoteEditTimeExceededException;
import com.dawn.backend.domain.note.exception.NoteNotFoundException;
import com.dawn.backend.domain.note.repository.EditableRepository;
import com.dawn.backend.domain.note.repository.ImageRepository;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.dto.PinGroupDto;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.exception.PinNotFoundException;
import com.dawn.backend.domain.pin.exception.PinVersionNotFoundException;
import com.dawn.backend.domain.pin.repository.PinRepository;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.uploader.dto.ImagePathDto;
import com.dawn.backend.global.util.uploader.service.UploadService;

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
	private final PinVersionRepository pinVersionRepository;
	private final ProjectRepository projectRepository;
	private final UploadService uploadService;
	private final EditableRepository editableRepository;

	/**
	 * 일정 시간마다 note.isDeleted = true 인 노트 삭제 로직 필요
	 */
	@Transactional
	public DeleteNoteResponseDto deleteNote(Long noteId) {
		if (!editableRepository.existsById(noteId)) {
			throw new NoteEditTimeExceededException();
		}

		Note note = getNoteById(noteId);
		note.deleteNote();

		return new DeleteNoteResponseDto(noteId);
	}

	@Transactional
	public UpdateNoteResponseDto updateNote(Long noteId, UpdateNoteRequestDto dto) {
		if (!editableRepository.existsById(noteId)) {
			throw new NoteEditTimeExceededException();
		}

		Note note = getNoteById(noteId);
		validateIsNoteDeleted(note.getIsDeleted());

		note.updateNoteTitle(dto.noteTitle());
		note.updateNoteContent(dto.noteContent());

		return new UpdateNoteResponseDto(note.getNoteId());
	}

	@Transactional
	public BookmarkNoteResponseDto updateBookmarkNote(Long noteId, BookmarkNoteRequestDto dto) {
		Note note = getNoteById(noteId);

		updateNoteBookmark(note);

		return BookmarkNoteResponseDto.from(note);
	}

	@Transactional
	public BookmarkImageResponseDto updateBookmarkImage(Long imageId, BookmarkImageRequestDto dto) {
		NoteImage noteImage = getNoteImageById(imageId);

		updateImageBookmark(noteImage);

		return BookmarkImageResponseDto.from(noteImage);
	}

	private void updateImageBookmark(NoteImage noteImage) {
		boolean bookmarked = noteImage.getBookmark();
		if (bookmarked) {
			noteImage.removeBookmark();
		} else {
			noteImage.addBookmark();
		}
	}

	private NoteImage getNoteImageById(Long imageId) {
		return imageRepository.findById(imageId)
			.orElseThrow(ImageNotFoundException::new);
	}

	private void updateNoteBookmark(Note note) {
		boolean bookmarked = note.getBookmark();
		if (bookmarked) {
			note.removeBookmark();
		} else {
			note.addBookmark();
		}
	}

	private void validateIsNoteDeleted(Boolean isDeleted) {
		if (isDeleted) {
			throw new DeletedNoteException();
		}
	}

	private Note getNoteById(Long noteId) {
		return noteRepository.findById(noteId)
			.orElseThrow(NoteNotFoundException::new);
	}

	@Transactional
	public CreateNoteResponseDto createNote(User user, Long pinId, CreateNoteRequestDto createNoteRequestDto) {

		BlueprintVersion blueprintVersion
			= blueprintVersionRepository.findById(createNoteRequestDto.blueprintVersionId())
			.orElseThrow(BlueprintNotFoundException::new);

		Pin pin = pinRepository.findById(pinId)
			.orElseThrow(PinNotFoundException::new);

		List<User> projectUsers =
			userProjectRepository.findUserByProjectProjectId(createNoteRequestDto.projectId())
				.stream()
				.map(UserProject::getUser)
				.toList();

		Note note = Note.builder()
			.noteTitle(createNoteRequestDto.noteTitle())
			.user(user)
			.noteContent(createNoteRequestDto.noteContent())
			.blueprintVersion(blueprintVersion)
			.pin(pin)
			.build();

		Note savedNote = noteRepository.save(note);
		editableRepository.save(new EditableNote(
			savedNote.getNoteId(),
			savedNote.getCreatedAt()
		));

		if (createNoteRequestDto.imageUrlList() != null) {
			for (String imageUrl : createNoteRequestDto.imageUrlList()) {
				ImagePathDto imagePathDto = uploadService.getImagePath(imageUrl);

				NoteImage noteImage = NoteImage.builder()
					.imageOrigin(imageUrl)
					.imagePreview(imagePathDto.previewPath())
					.note(savedNote)
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

		projectUsers.stream()
			.filter(projectUser -> !projectUser.equals(user))
			.map(projectUser -> UserNoteCheck.builder()
				.note(savedNote)
				.user(projectUser)
				.build())
			.forEach(noteCheckRepository::save);

		return new CreateNoteResponseDto(savedNote.getNoteId());
	}

	public GetNotesByPinResponseDto getNotesByPin(Long pinId, GetNotesByPinRequestDto getNotesByPinRequestDto) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}

		List<Note> notes = noteRepository.findAllByPinPinIdAndIsDeletedFalse(pinId);

		List<NoteItem> noteItems = notes.stream()
			.map(note -> {
				ProjectUserDto noteWriter =
					userRepository.findUserWithRoleByUserIdAndProjectId(
						note.getUser().getUserId(),
						getNotesByPinRequestDto.projectId());
				boolean isPresentImage = imageRepository.existsByNoteNoteId(note.getNoteId());

				List<ProjectUserDto> readUsers =
					userRepository.findCheckedUsersWithRolesByNoteId(note.getNoteId(),
						getNotesByPinRequestDto.projectId());

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

	public GetBookmarkNotesResponseDto getBookmarkNotes(Long pinId, GetBookmarkNotesRequestDto request) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}

		List<Note> bookmarkedNotes = noteRepository.findAllByPinPinIdAndBookmarkAndIsDeletedFalse(pinId, true);

		List<BookmarkNoteItem> noteItems = bookmarkedNotes.stream()
			.map(note -> {
				ProjectUserDto noteWriter =
					userRepository.findUserWithRoleByUserIdAndProjectId(
						note.getUser().getUserId(),
						request.projectId());
				boolean isPresentImage = imageRepository.existsByNoteNoteId(note.getNoteId());
				return new BookmarkNoteItem(
					note.getNoteId(),
					noteWriter,
					note.getNoteTitle(),
					note.getBookmark(),
					note.getCreatedAt(),
					isPresentImage
				);
			}).collect(Collectors.toList());

		return new GetBookmarkNotesResponseDto(noteItems);
	}

	private void validatePinExist(Long pinId) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}
	}

	public GetNotesByBlueprintResponseDto getNotesByBlueprint(
		Long blueprintId, Long blueprintVersion, GetNotesByBlueprintRequestDto request, Long cursorId, int size
	) {
		if (!blueprintVersionRepository.existsById(blueprintVersion)) {
			throw new NoteByBlueprintVersionNotFound();
		}

		PageRequest pageRequest = PageRequest.of(0, size + 1);

		List<Note> notes = noteRepository.findNotesByBlueprintVersionAfterCursor(
			blueprintVersion,
			cursorId,
			pageRequest
		);

		boolean hasMore = notes.size() == size + 1;
		if (hasMore) {
			notes = notes.subList(0, size);
		}

		Collections.reverse(notes);

		List<ChatItemDto> resultList = convertNotesToChatItemsForBlueprint(notes, request.projectId());


		return new GetNotesByBlueprintResponseDto(resultList, hasMore);
	}

	private List<ChatItemDto> convertNotesToChatItemsForBlueprint(List<Note> notes, Long projectId) {
		List<ChatItemDto> items = new ArrayList<>();
		LocalDateTime prevDate = null;

		for (Note note : notes) {
			LocalDateTime currentDate = note.getCreatedAt().toLocalDate().atStartOfDay();
			if (prevDate == null || !currentDate.equals(prevDate)) {
				items.add(DateSeparatorDto.from(note.getCreatedAt()));
				prevDate = currentDate;
			}

			ProjectUserDto noteWriter = userRepository.findUserWithRoleByUserIdAndProjectId(
				note.getUser().getUserId(), projectId
			);
			boolean isPresentImage = imageRepository.existsByNoteNoteId(note.getNoteId());
			List<ProjectUserDto> readUsers = userRepository.findCheckedUsersWithRolesByNoteId(
				note.getNoteId(), projectId
			);

			ChatItemDto noteItemDto = NoteItemWithTypeDto.fromForBlueprint(note, noteWriter, isPresentImage, readUsers);
			items.add(noteItemDto);
		}
		return items;
	}

	@Transactional
	public NoteDetailResponseDto findDetailNote(Long noteId, User user) {
		Note note = getNoteById(noteId);

		validateNoteIsDeleted(note);

		// 노트를 읽음 여부 처리
		updateUserNoteCheck(note, user);

		//해당 노트를 작성한 유저의 정보 가져오기
		Project project = getProjectByNoteId(note);
		ProjectUserDto noteWriter = getNoteWriter(note, project.getProjectId());

		List<NoteImage> noteImages = getNoteImages(noteId);

		boolean isEditable =
			editableRepository.existsById(note.getNoteId());

		NoteDto noteDto = NoteDto.from(note, noteWriter, noteImages, isEditable);

		PinGroupDto pinGroupDto = getPinGroupDto(note, noteId);

		return new NoteDetailResponseDto(noteDto, pinGroupDto);
	}

	/**
	 * 노트와 연결된 PinVersion, PinGroup 정보를 조회하고 PinGroupDto로 변환한다.
	 */
	private PinGroupDto getPinGroupDto(Note note, Long noteId) {
		PinVersion pinVersion = pinVersionRepository
			.findByBlueprintVersionAndPinAndIsActive(note.getBlueprintVersion(), note.getPin(), true)
			.orElseThrow(PinVersionNotFoundException::new);

		return PinGroupDto.from(pinVersion.getPinGroup());
	}

	/**
	 * 노트 이미지 목록을 조회한다.
	 */
	private List<NoteImage> getNoteImages(Long noteId) {
		return imageRepository.findAllByNoteNoteIdOrderByBookmark(noteId);
	}

	private ProjectUserDto getNoteWriter(Note note, Long projectId) {
		return userRepository.findUserWithRoleByUserIdAndProjectId(
			note.getUser().getUserId(),
			projectId
		);
	}

	private Project getProjectByNoteId(Note note) {
		return projectRepository.findByNoteId(note.getNoteId())
			.orElseThrow(ProjectNotFoundException::new);
	}

	private void validateNoteIsDeleted(Note note) {
		if (note.getIsDeleted()) {
			throw new DeletedNoteException();
		}
	}

	private void updateUserNoteCheck(Note note, User user) {
		boolean exists = noteCheckRepository.existsByUserAndNote(user, note);
		if (!exists) {
			UserNoteCheck userNoteCheck = UserNoteCheck.builder()
				.user(user)
				.note(note)
				.build();
			userNoteCheck.updateNoteCheck(true);
			noteCheckRepository.save(userNoteCheck);
		}
	}

	@Transactional
	public RecentNoteResponseDto getRecentNoteByPin(Long pinId) {
		Pin pin = pinRepository.findById(pinId)
			.orElseThrow(PinNotFoundException::new);

		Note recentNote = noteRepository.findFirstByPinPinIdAndIsDeletedFalseOrderByCreatedAtDesc(pinId)
			.orElseThrow(NoteNotFoundException::new);

		List<NoteImage> noteImages = imageRepository.findAllByNoteNoteIdOrderByBookmark(recentNote.getNoteId());

		ProjectUserDto writerDto = ProjectUserDto.from(recentNote.getUser(), "USER");

		boolean isEditable =
			editableRepository.existsById(recentNote.getNoteId());

		NoteDto noteDto = NoteDto.from(recentNote, writerDto, noteImages, isEditable);

		return new RecentNoteResponseDto(noteDto);
	}
}
