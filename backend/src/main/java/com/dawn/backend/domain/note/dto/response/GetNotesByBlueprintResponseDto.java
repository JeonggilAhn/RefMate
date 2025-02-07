package com.dawn.backend.domain.note.dto.response;

import java.util.List;

import com.dawn.backend.domain.note.dto.ChatItemDto;
import com.dawn.backend.domain.note.dto.NoteItem;

public record GetNotesByBlueprintResponseDto(
	List<ChatItemDto> noteList,
	boolean hasMore
) {
}
