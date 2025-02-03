package com.dawn.backend.domain.note.dto.request;

public record UpdateNoteRequestDto(
	String noteTitle,
	String noteContent
) {
}
