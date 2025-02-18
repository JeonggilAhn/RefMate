package com.dawn.backend.domain.note.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintNotFoundException;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.dto.BlueprintNoteItemDto;
import com.dawn.backend.domain.note.dto.ChatItemDto;
import com.dawn.backend.domain.note.dto.DateSeparatorDto;
import com.dawn.backend.domain.note.dto.GetNotesByRangeResponseDto;
import com.dawn.backend.domain.note.dto.NoteDto;
import com.dawn.backend.domain.note.dto.NoteItemWithTypeDto;
import com.dawn.backend.domain.note.dto.NoteWithPinAndPinGroupDto;
import com.dawn.backend.domain.note.dto.request.BookmarkImageRequestDto;
import com.dawn.backend.domain.note.dto.request.BookmarkNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.UpdateNoteRequestDto;
import com.dawn.backend.domain.note.dto.response.BookmarkImageResponseDto;
import com.dawn.backend.domain.note.dto.response.BookmarkNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.CreateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.GetBookmarkNotesResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByBlueprintResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByKewordByPinResponseDto;
import com.dawn.backend.domain.note.dto.response.GetNotesByKeywordResponseDto;
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
import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.pin.dto.PinGroupDto;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.exception.PinNotFoundException;
import com.dawn.backend.domain.pin.exception.PinVersionNotFoundException;
import com.dawn.backend.domain.pin.repository.PinRepository;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.pin.service.PinService;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.dto.ProjectUserWithReadNoteDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.exception.UserProjectNotFound;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.uploader.dto.ImagePathDto;
import com.dawn.backend.global.util.uploader.service.UploadService;

@Slf4j
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
	private final PinService pinService;

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

		List<ImageItem> imageItems = new ArrayList<>();
		boolean isPresentImage = createNoteRequestDto.imageUrlList() != null
			&& !createNoteRequestDto.imageUrlList().isEmpty();
		if (isPresentImage) {
			List<NoteImage> noteImages = createNoteRequestDto.imageUrlList().stream()
				.map((imageUrl) -> {
					ImagePathDto imagePathDto = uploadService.getImagePath(imageUrl);

					return NoteImage.builder()
						.imageOrigin(imageUrl)
						.imagePreview(imagePathDto.previewPath())
						.note(savedNote)
						.build();
				})
				.toList();

			List<NoteImage> savedNoteImage = imageRepository.saveAll(noteImages);

			imageItems = savedNoteImage.stream()
				.map((ImageItem::from))
				.toList();
		}

		UserNoteCheck creatorNoteCheck = UserNoteCheck.builder()
			.note(note)
			.user(user)
			.build();
		creatorNoteCheck.updateNoteCheck(true);
		noteCheckRepository.save(creatorNoteCheck);

//		projectUsers.stream()
//			.filter(projectUser -> !projectUser.getUserId().equals(user.getUserId()))
//			.map(projectUser -> UserNoteCheck.builder()
//				.note(savedNote)
//				.user(projectUser)
//				.build())
//			.forEach(noteCheckRepository::save);

		UserProject userWithRole = userProjectRepository.findByUserIdAndProjectId(
			user.getUserId(), createNoteRequestDto.projectId()).orElseThrow(UserProjectNotFound::new);

		ProjectUserDto noteWriter = ProjectUserDto.from(userWithRole);

		List<ProjectUserDto> readUsers = userRepository.findCheckedUsersWithRolesByNoteId(
			note.getNoteId(), createNoteRequestDto.projectId()
		);

		DateSeparatorDto dateSeparator = DateSeparatorDto.from(note.getCreatedAt());
		ChatItemDto noteItemDto = NoteItemWithTypeDto.fromForPin(
			note,
			noteWriter,
			isPresentImage,
			readUsers
		);
		return new CreateNoteResponseDto(
			dateSeparator,
			noteItemDto,
			imageItems
		);
	}

	public GetNotesByPinResponseDto getNotesByPin(Long pinId, Long projectId) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}

		List<Note> notes = noteRepository.findAllByPinPinIdAndIsDeletedFalse(pinId);

		List<ChatItemDto> charItems = convertNotesToChatItemsForPin(notes, projectId);

		return new GetNotesByPinResponseDto(charItems);
	}

	private List<ChatItemDto> convertNotesToChatItemsForPin(List<Note> notes, Long projectId) {
		List<ChatItemDto> items = new ArrayList<>();
		LocalDateTime prevDate = null;

		for (Note note : notes) {
			LocalDateTime currentDate = note.getCreatedAt().toLocalDate().atStartOfDay();

			if (prevDate == null || !currentDate.equals(prevDate)) {
				items.add(DateSeparatorDto.from(note.getCreatedAt()));
				prevDate = currentDate;
			}

			ProjectUserDto noteWriter = userRepository.findUserWithRoleByUserIdAndProjectId(
				note.getUser().getUserId(),
				projectId
			);
			boolean isPresentImage = imageRepository.existsByNoteNoteId(note.getNoteId());
			List<ProjectUserDto> readUsers = userRepository.findCheckedUsersWithRolesByNoteId(
				note.getNoteId(), projectId
			);

			ChatItemDto noteItemDto = NoteItemWithTypeDto.fromForPin(
				note, noteWriter, isPresentImage, readUsers
			);
			items.add(noteItemDto);
		}

		return items;
	}

	public GetBookmarkNotesResponseDto getBookmarkNotes(Long pinId, Long projectId) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}

		List<Note> bookmarkedNotes = noteRepository.findAllByPinPinIdAndBookmarkAndIsDeletedFalse(pinId, true);

		List<ChatItemDto> chatItems = convertNotesToChatItemsForPin(bookmarkedNotes, projectId);

		return new GetBookmarkNotesResponseDto(chatItems);
	}

	private void validatePinExist(Long pinId) {
		if (!pinRepository.existsById(pinId)) {
			throw new PinNotFoundException();
		}
	}

	public GetNotesByBlueprintResponseDto getNotesByBlueprint(
		Long blueprintId, Long blueprintVersion, Long projectId, Long cursorId, int size
	) {
		if (!blueprintVersionRepository.existsById(blueprintVersion)) {
			throw new NoteByBlueprintVersionNotFound();
		}

		PageRequest pageRequest = PageRequest.of(0, size + 1);

		List<NoteWithPinAndPinGroupDto> noteDtos =
			noteRepository.findNotesWithPinAndPinGroupsByBlueprintVersionAfterCursor(
			blueprintId,
			blueprintVersion,
			cursorId,
			pageRequest
		);

		boolean hasMore = noteDtos.size() == size + 1;
		if (hasMore) {
			noteDtos = noteDtos.subList(0, size);
		}

		Collections.reverse(noteDtos);

		List<ChatItemDto> chatItems = new ArrayList<>();
		LocalDateTime prevDate = null;

		for (NoteWithPinAndPinGroupDto dto : noteDtos) {
			LocalDateTime currentDate = dto.createdAt().toLocalDate().atStartOfDay();

			if (prevDate == null || !currentDate.equals(prevDate)) {
				chatItems.add(DateSeparatorDto.from(currentDate));
				prevDate = currentDate;
			}

			List<ProjectUserDto> readUsers = userRepository.findCheckedUsersWithRolesByNoteId(dto.noteId(), projectId);

			chatItems.add(BlueprintNoteItemDto.from(dto, readUsers));
		}

		return new GetNotesByBlueprintResponseDto(chatItems, hasMore);

	}

	@Transactional
	public NoteDetailResponseDto findDetailNote(Long noteId, User user) {
		Note note = getNoteById(noteId);

		validateNoteIsDeleted(note);

		//해당 노트를 작성한 유저의 정보 가져오기
		Project project = getProjectByNoteId(note);
		ProjectUserDto noteWriter = getNoteWriter(note, project.getProjectId());

		List<NoteImage> noteImages = getNoteImages(noteId);

		boolean isEditable =
			editableRepository.existsById(note.getNoteId());

		NoteDto noteDto = NoteDto.from(note, noteWriter, noteImages, isEditable);

		PinGroupDto pinGroupDto = getPinGroupDto(note, noteId);

		UserNoteCheck userNoteCheck = noteCheckRepository.findByNoteNoteIdAndUser(noteId, user);
		if (userNoteCheck == null) {
			userNoteCheck = UserNoteCheck.builder()
				.note(note)
				.user(user)
				.build();
			userNoteCheck.updateNoteCheck(true);
			noteCheckRepository.save(userNoteCheck);
		}

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

	@Transactional
	public RecentNoteResponseDto getRecentNoteByPin(Long pinId) {
		Pin pin = pinRepository.findById(pinId)
			.orElseThrow(PinNotFoundException::new);

		Note recentNote = noteRepository.findFirstByPinPinIdAndIsDeletedFalseOrderByCreatedAtDesc(pinId);

		if (recentNote == null) {
			return new RecentNoteResponseDto(null);
		}

		List<NoteImage> noteImages = imageRepository.findAllByNoteNoteIdOrderByBookmark(recentNote.getNoteId());

		ProjectUserDto writerDto = ProjectUserDto.from(recentNote.getUser(), "USER");

		boolean isEditable =
			editableRepository.existsById(recentNote.getNoteId());

		NoteDto noteDto = NoteDto.from(recentNote, writerDto, noteImages, isEditable);

		return new RecentNoteResponseDto(noteDto);
	}

	@Transactional
	public GetNotesByKeywordResponseDto getNotesByKeyword(
		Long projectId, Long blueprintId, Long blueprintVersionId, String keyword
	) {
		List<Long> matchesNoteIds = noteRepository.findNoteByKeyword(blueprintVersionId, keyword);
		return GetNotesByKeywordResponseDto.from(matchesNoteIds);
	}

	public GetNotesByKewordByPinResponseDto getNotesByKeywordByPin(Long projectId, Long pinId, String keyword) {
		List<Long> matchesnoteIds = noteRepository.findNoteByKeywordByPin(pinId, keyword);
		return GetNotesByKewordByPinResponseDto.from(matchesnoteIds);
	}

	public GetNotesByRangeResponseDto getNotesByRange(
		Long projectId, Long blueprintId, Long blueprintVersionId, Long nextId, Long lastId
	) {
		List<NoteWithPinAndPinGroupDto> noteDtos = noteRepository.findNotesWithPinAndPinGroupsByRange(
			blueprintVersionId, nextId, lastId
		);

		if (noteDtos.isEmpty()) {
			return new GetNotesByRangeResponseDto(Collections.emptyList());
		}

		List<Long> noteIds = noteDtos.stream()
			.map(NoteWithPinAndPinGroupDto::noteId)
			.toList();

		// 읽은 noteId를 가지는 user들을 조회
		List<ProjectUserWithReadNoteDto> readUsers =
			userRepository.findCheckedUsersWithRolesByNoteIds(noteIds, projectId);

		// 읽은 user들을 noteId 로 그룹핑
		Map<Long, List<ProjectUserDto>> readUsersMap = readUsers.stream()
			.collect(Collectors.groupingBy(
				ProjectUserWithReadNoteDto::noteId,
				Collectors.mapping(dto -> new ProjectUserDto(
					dto.userId(),
					dto.userEmail(),
					dto.profileUrl(),
					dto.signupDate(),
					dto.role()
				), Collectors.toList())
			));

		List<ChatItemDto> chatItems = new ArrayList<>();
		LocalDateTime prevDate = null;

		for (NoteWithPinAndPinGroupDto dto : noteDtos) {
			LocalDateTime currentDate = dto.createdAt().toLocalDate().atStartOfDay();

			if (prevDate == null || !currentDate.equals(prevDate)) {
				chatItems.add(DateSeparatorDto.from(currentDate));
				prevDate = currentDate;
			}
			List<ProjectUserDto> mappedReadUsers = readUsersMap.getOrDefault(dto.noteId(), Collections.emptyList());

			BlueprintNoteItemDto blueprintNoteItemDto = BlueprintNoteItemDto.from(dto, mappedReadUsers);
			chatItems.add(blueprintNoteItemDto);
		}
		return new GetNotesByRangeResponseDto(chatItems);

	}
}
