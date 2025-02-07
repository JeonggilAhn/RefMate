package com.dawn.backend.domain.note.dto.request;

public record BookmarkNoteRequestDto(
	Long projectId,
	boolean bookmark
) {
}
