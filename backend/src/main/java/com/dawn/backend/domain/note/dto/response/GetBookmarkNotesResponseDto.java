package com.dawn.backend.domain.note.dto.response;

import java.util.List;

import com.dawn.backend.domain.note.dto.BookmarkNoteItem;

public record GetBookmarkNotesResponseDto(
	List<BookmarkNoteItem> noteList
) {
}
