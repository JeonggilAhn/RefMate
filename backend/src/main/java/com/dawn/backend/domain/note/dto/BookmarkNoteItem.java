package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;

import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record BookmarkNoteItem(
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	Boolean isBookmark,
	LocalDateTime createdAt,
	Boolean isPresentImage
) {
}
