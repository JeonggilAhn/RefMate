package com.dawn.backend.domain.note.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.note.dto.GetNotesByRangeResponseDto;
import com.dawn.backend.domain.note.dto.request.BookmarkImageRequestDto;
import com.dawn.backend.domain.note.dto.request.BookmarkNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.GetBookmarkNotesRequestDto;
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
import com.dawn.backend.domain.note.service.NoteService;
import com.dawn.backend.domain.note.service.ReadCheckService;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class NoteController {

	private final NoteService noteService;
	private final ReadCheckService readCheckService;

	@DeleteMapping("/notes/{noteId}")
	@PreAuthorize("@authExpression.isNoteWriter(#noteId)")
	public ResponseEntity<ResponseWrapper<DeleteNoteResponseDto>> deleteNote(@PathVariable Long noteId) {
		DeleteNoteResponseDto response = noteService.deleteNote(noteId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@PostMapping("/pins/{pinId}/notes")
	@PreAuthorize("@authExpression.hasProjectPermissionByPinId(#pinId)")
	public ResponseEntity<ResponseWrapper<CreateNoteResponseDto>> createNote(
		@PathVariable("pinId") Long pinId,
		@RequestBody CreateNoteRequestDto createNoteRequestDto,
		@AuthenticationPrincipal User user
	) {
		CreateNoteResponseDto createNoteResponseDto = noteService.createNote(user, pinId, createNoteRequestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, createNoteResponseDto);
	}

	@PutMapping("/notes/{noteId}")
	@PreAuthorize("@authExpression.isNoteWriter(#noteId)")
	public ResponseEntity<ResponseWrapper<UpdateNoteResponseDto>> updateNote(
		@PathVariable Long noteId,
		@RequestBody UpdateNoteRequestDto requestDto
	) {
		UpdateNoteResponseDto responseDto = noteService.updateNote(noteId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@PatchMapping("/notes/{noteId}/bookmark")
	@PreAuthorize("@authExpression.hasProjectPermissionByNoteId(#noteId)")
	public ResponseEntity<ResponseWrapper<BookmarkNoteResponseDto>> updateNoteBookmark(
		@PathVariable Long noteId,
		@RequestBody BookmarkNoteRequestDto requestDto
	) {
		BookmarkNoteResponseDto responseDto = noteService.updateBookmarkNote(noteId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes")
	@PreAuthorize("@authExpression.hasProjectPermissionByPinId(#pinId)")
	public ResponseEntity<ResponseWrapper<GetNotesByPinResponseDto>> getNotesByPin(
		@PathVariable Long pinId,
		@RequestParam("project_id") Long projectId
	) {
		GetNotesByPinResponseDto getNotesByPinResponseDto = noteService.getNotesByPin(pinId, projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, getNotesByPinResponseDto);
	}


	@PatchMapping("/images/{imageId}/bookmark")
	@PreAuthorize("@authExpression.hasProjectPermissionByImageId(#imageId)")
	public ResponseEntity<ResponseWrapper<BookmarkImageResponseDto>> updateNoteImageBookmark(
		@PathVariable Long imageId,
		@RequestBody BookmarkImageRequestDto requestDto
	) {
		BookmarkImageResponseDto responseDto = noteService.updateBookmarkImage(imageId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes/bookmark")
	@PreAuthorize("@authExpression.hasProjectPermissionByPinId(#pinId)")
	public ResponseEntity<ResponseWrapper<GetBookmarkNotesResponseDto>> getNotesBookmark(
		@PathVariable Long pinId,
		@RequestParam("project_id") Long projectId
	) {
		GetBookmarkNotesResponseDto response = noteService.getBookmarkNotes(pinId, projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/blueprints/{blueprintId}/{blueprintVersion}/notes")
	@PreAuthorize("@authExpression.hasProjectPermissionByBlueprintId(#blueprintId)")
	public ResponseEntity<ResponseWrapper<GetNotesByBlueprintResponseDto>> getNotesByBlueprint(
		@PathVariable Long blueprintId,
		@PathVariable Long blueprintVersion,
		@RequestParam(value = "project_id") Long projectId,
		@RequestParam(value = "cursor_id", required = false, defaultValue = Long.MAX_VALUE + "") Long cursorId,
		@RequestParam(value = "size", required = false, defaultValue = "10") int size
	) {
		GetNotesByBlueprintResponseDto responseDto =
			noteService.getNotesByBlueprint(blueprintId, blueprintVersion, projectId, cursorId, size);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/notes/{noteId}")
	@PreAuthorize("@authExpression.hasProjectPermissionByNoteId(#noteId)")
	public ResponseEntity<ResponseWrapper<NoteDetailResponseDto>> findDetailNote(
		@PathVariable Long noteId,
		@AuthenticationPrincipal User user
	) throws Exception {
		NoteDetailResponseDto responseDto = noteService.findDetailNote(noteId, user);
//		readCheckService.sendEvent(noteId, user);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes/recent")
	@PreAuthorize("@authExpression.hasProjectPermissionByPinId(#pinId)")
	public ResponseEntity<ResponseWrapper<RecentNoteResponseDto>> getRecentNote(
		@PathVariable Long pinId
	) {
		RecentNoteResponseDto responseDto = noteService.getRecentNoteByPin(pinId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

//	@GetMapping("/blueprints/{blueprintId}/task/read")
//	@PreAuthorize("@authExpression.hasBlueprintPermission(#blueprintId)")
//	public SseEmitter readNoteTasks(@PathVariable Long blueprintId) {
//		return readCheckService.getSseEmitter(blueprintId);
//	}

	/**
	 * 검색어(keyword)에 해당하는 노트들 중에서
	 * - centerNoteId가 null이면 "가장 최신 노트"를 센터로 선택하고,
	 * - 그렇지 않으면 전달받은 노트를 센터로 하여
	 * 센터 노트의 앞(신규 쪽) 및 뒤(구형 쪽) 각각 최대 surroundCount+1(더보기 판별)을 조회한 후
	 * 센터 노트를 포함하여 주변 노트들을 DTO로 매핑하여 반환한다.
	 *
	 * @param keyword 검색어
	 * @return GetNotesByKeywordResponseDto
	 */
	@GetMapping("/{projectId}/blueprints/{blueprintId}/{blueprintVersionId}/notes/search")
	@PreAuthorize("@authExpression.hasProjectPermissionByBlueprintId(#blueprintId)")
	public ResponseEntity<ResponseWrapper<GetNotesByKeywordResponseDto>> getNotesByKeyword(
		@PathVariable Long projectId,
		@PathVariable Long blueprintId,
		@PathVariable Long blueprintVersionId,
		@RequestParam String keyword
	) {
		GetNotesByKeywordResponseDto responseDto = noteService.getNotesByKeyword(
			projectId, blueprintId, blueprintVersionId, keyword
		);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/{projectId}/pin/{pinId}/notes/search")
	@PreAuthorize("@authExpression.hasProjectPermissionByPinId(#pinId)"
		+ "AND @authExpression.hasProjectPermissionByPinId(#pinId)")
	public ResponseEntity<ResponseWrapper<GetNotesByKewordByPinResponseDto>> getNotesByKeywordByPin(
		@PathVariable Long projectId,
		@PathVariable Long pinId,
		@RequestParam String keyword
	) {
		GetNotesByKewordByPinResponseDto responseDto = noteService.getNotesByKeywordByPin(
			projectId, pinId, keyword
		);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/blueprints/{blueprintId}/{blueprintVersionId}/notes/range")
	@PreAuthorize("@authExpression.hasProjectPermissionByProjectId(#projectId)")
	public ResponseEntity<ResponseWrapper<GetNotesByRangeResponseDto>> getNotesByRange(
		@PathVariable Long blueprintId,
		@PathVariable Long blueprintVersionId,
		@RequestParam(value = "project_id") Long projectId,
		@RequestParam(value = "next_id") Long nextId,
		@RequestParam(value = "last_id") Long lastId
	) {
		GetNotesByRangeResponseDto responseDto = noteService.getNotesByRange(
			projectId, blueprintId, blueprintVersionId, nextId, lastId
		);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}
}
