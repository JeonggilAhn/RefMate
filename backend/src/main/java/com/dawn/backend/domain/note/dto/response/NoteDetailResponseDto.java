package com.dawn.backend.domain.note.dto.response;

import com.dawn.backend.domain.note.dto.NoteDto;
import com.dawn.backend.domain.pin.dto.PinGroupDto;

public record NoteDetailResponseDto(
	NoteDto note,
	PinGroupDto pinGroup
) {
}
