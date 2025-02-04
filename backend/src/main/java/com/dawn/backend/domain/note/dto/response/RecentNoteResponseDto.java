package com.dawn.backend.domain.note.dto.response;

import com.dawn.backend.domain.note.dto.NoteDto;

public record RecentNoteResponseDto(
	NoteDto note
) {
}
