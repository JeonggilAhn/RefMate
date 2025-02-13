package com.dawn.backend.domain.note.dto.response;

import com.dawn.backend.domain.note.dto.ChatItemDto;
import com.dawn.backend.domain.note.dto.DateSeparatorDto;

public record CreateNoteResponseDto(
	DateSeparatorDto dateSeparator,
	ChatItemDto note
) {
}
