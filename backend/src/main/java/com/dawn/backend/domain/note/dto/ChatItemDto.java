package com.dawn.backend.domain.note.dto;

public sealed interface ChatItemDto
	permits DateSeparatorDto, NoteItemWithTypeDto, BlueprintNoteItemDto, NoteItemByBlueprint {
	String type();
}
