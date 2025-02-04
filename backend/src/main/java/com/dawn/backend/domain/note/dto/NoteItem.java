package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteItem(
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	Boolean isBookmark,
	LocalDateTime createdAt,
	Boolean isPresentImage,
	List<ProjectUserDto> readUsers
) {
	public static NoteItem from(
		Note note,
		ProjectUserDto noteWriter,
		Boolean isPresentImage,
		List<ProjectUserDto> readUsers
	) {
		return new NoteItem(
			note.getNoteId(),
			noteWriter,
			note.getNoteTitle(),
			note.getBookmark(),
			note.getCreatedAt(),
			isPresentImage,
			readUsers
		);
	}
}
