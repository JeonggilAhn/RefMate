package com.dawn.backend.domain.note.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.note.dto.request.CreateNoteRequestDto;
import com.dawn.backend.domain.note.dto.response.CreateNoteResponseDto;
import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
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

	@PostMapping("/pins/{pinId}/notes/{userId}")
	public ResponseEntity<ResponseWrapper<CreateNoteResponseDto>> createNote(
			@PathVariable("userId") Long userId,
			@PathVariable("pinId") Long pinId,
			@RequestBody CreateNoteRequestDto createNoteRequestDto
	) {
		CreateNoteResponseDto createNoteResponseDto = noteService.createNote(userId, pinId, createNoteRequestDto);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, createNoteResponseDto);
	}
}
