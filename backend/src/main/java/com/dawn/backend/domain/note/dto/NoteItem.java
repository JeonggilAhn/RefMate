package com.dawn.backend.domain.note.dto;

import java.util.List;

import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteItem(
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	Boolean isBookmark,
	String createdAt,
	Boolean isPresentImage,
	List<ProjectUserDto> readUsers
) {
}
