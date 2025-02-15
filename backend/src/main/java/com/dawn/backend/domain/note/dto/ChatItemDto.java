package com.dawn.backend.domain.note.dto;

public sealed interface ChatItemDto
	permits DateSeparatorDto, NoteItemWithTypeDto, BlueprintNoteItemDto {
	String type();
}
