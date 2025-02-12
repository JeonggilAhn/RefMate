package com.dawn.backend.domain.note.dto.response;

import java.util.List;

import com.dawn.backend.domain.note.dto.ChatItemDto;

public record GetNotesByPinResponseDto(
	List<ChatItemDto> noteList
) {
}
