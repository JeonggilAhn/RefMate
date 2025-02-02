package com.dawn.backend.domain.note.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.service.NoteService;

@RestController
@RequiredArgsConstructor
public class NoteController {

	private final NoteService noteService;

	@DeleteMapping("/notes/{noteId}")
	public ResponseEntity<DeleteNoteResponseDto> deleteNote(@PathVariable Long noteId) {
		DeleteNoteResponseDto response = noteService.deleteNote(noteId);
		return ResponseEntity.ok(response);
	}
}
