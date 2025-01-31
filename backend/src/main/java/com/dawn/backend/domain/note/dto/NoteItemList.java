package com.dawn.backend.domain.note.dto;

import java.util.List;

public record NoteItemList(
	List<NoteItem> noteList
) {
}
