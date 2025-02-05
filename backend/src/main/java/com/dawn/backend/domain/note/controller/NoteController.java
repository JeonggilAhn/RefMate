package com.dawn.backend.domain.note.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.note.dto.request.BookmarkImageRequestDto;
import com.dawn.backend.domain.note.dto.request.BookmarkNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.request.GetBookmarkNotesRequestDto;
import com.dawn.backend.domain.note.dto.request.GetNotesByBlueprintRequestDto;
import com.dawn.backend.domain.note.dto.request.GetNotesByPinRequestDto;
import com.dawn.backend.domain.note.dto.request.NoteDetailRequestDto;
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
import com.dawn.backend.domain.note.service.NoteService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class NoteController {

	private final NoteService noteService;

	@DeleteMapping("/notes/{noteId}")
	public ResponseEntity<DeleteNoteResponseDto> deleteNote(@PathVariable Long noteId) {
		DeleteNoteResponseDto response = noteService.deleteNote(noteId);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/pins/{pinId}/notes")
	public ResponseEntity<ResponseWrapper<CreateNoteResponseDto>> createNote(
		@PathVariable("pinId") Long pinId,
		@RequestBody CreateNoteRequestDto createNoteRequestDto
	) {
		CreateNoteResponseDto createNoteResponseDto = noteService.createNote(1L, pinId, createNoteRequestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, createNoteResponseDto);
	}

	@PutMapping("/notes/{noteId}")
	public ResponseEntity<ResponseWrapper<UpdateNoteResponseDto>> updateNote(
		@PathVariable Long noteId,
		@RequestBody UpdateNoteRequestDto requestDto
	) {
		UpdateNoteResponseDto responseDto = noteService.updateNote(noteId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@PatchMapping("/notes/{noteId}/bookmark")
	public ResponseEntity<ResponseWrapper<BookmarkNoteResponseDto>> updateNoteBookmark(
		@PathVariable Long noteId,
		@RequestBody BookmarkNoteRequestDto requestDto
	) {
		BookmarkNoteResponseDto responseDto = noteService.updateBookmarkNote(noteId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes")
	public ResponseEntity<ResponseWrapper<GetNotesByPinResponseDto>> getNotesByPin(
		@PathVariable Long pinId,
		@RequestBody GetNotesByPinRequestDto getNotesByPinRequestDto
	) {
		GetNotesByPinResponseDto getNotesByPinResponseDto = noteService.getNotesByPin(pinId, getNotesByPinRequestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, getNotesByPinResponseDto);
	}

	@PatchMapping("/images/{imageId}/bookmark")
	public ResponseEntity<ResponseWrapper<BookmarkImageResponseDto>> updateNoteImageBookmark(
		@PathVariable Long imageId,
		@RequestBody BookmarkImageRequestDto requestDto
	) {
		BookmarkImageResponseDto responseDto = noteService.updateBookmarkImage(imageId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes/bookmark")
	public ResponseEntity<ResponseWrapper<GetBookmarkNotesResponseDto>> getNotesBookmark(
		@PathVariable Long pinId,
		@RequestBody GetBookmarkNotesRequestDto request
	) {
		GetBookmarkNotesResponseDto response = noteService.getBookmarkNotes(pinId, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	@GetMapping("/blueprints/{blueprintId}/{blueprintVersion}/notes")
	public ResponseEntity<ResponseWrapper<GetNotesByBlueprintResponseDto>> getNotesByBlueprint(
		@PathVariable Long blueprintId,
		@PathVariable Long blueprintVersion,
		@RequestBody GetNotesByBlueprintRequestDto request
	) {
		GetNotesByBlueprintResponseDto response =
			noteService.getNotesByBlueprint(blueprintId, blueprintVersion, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, response);
	}

	// 토큰 로직 -> 추후 NoteDetailRequestDto 삭제
	@GetMapping("/notes/{noteId}")
	public ResponseEntity<ResponseWrapper<NoteDetailResponseDto>> findDetailNote(
		@PathVariable Long noteId,
		@RequestBody NoteDetailRequestDto requestDto
	) {
		NoteDetailResponseDto responseDto = noteService.findDetailNote(noteId, requestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}

	@GetMapping("/pins/{pinId}/notes/recent")
	public ResponseEntity<ResponseWrapper<RecentNoteResponseDto>> getRecentNote(
		@PathVariable Long pinId) {
		RecentNoteResponseDto responseDto = noteService.getRecentNoteByPin(pinId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, responseDto);
	}
}
