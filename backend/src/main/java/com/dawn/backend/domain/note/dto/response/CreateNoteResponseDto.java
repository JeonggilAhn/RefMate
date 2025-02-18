package com.dawn.backend.domain.note.dto.response;

import java.util.List;

import com.dawn.backend.domain.note.dto.ChatItemDto;
import com.dawn.backend.domain.note.dto.DateSeparatorDto;
import com.dawn.backend.domain.pin.dto.ImageItem;

public record CreateNoteResponseDto(
	DateSeparatorDto dateSeparator,
	ChatItemDto note,
	List<ImageItem> imageList
) {
}
