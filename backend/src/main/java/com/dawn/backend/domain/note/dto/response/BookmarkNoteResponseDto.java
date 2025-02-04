package com.dawn.backend.domain.note.dto.response;

import com.dawn.backend.domain.note.entity.Note;

public record BookmarkNoteResponseDto(
	Long noteId,
	boolean bookmark

) {
	public static BookmarkNoteResponseDto from(Note note) {
		return new BookmarkNoteResponseDto(
			note.getNoteId(),
			note.getBookmark()
		);
	}
}
