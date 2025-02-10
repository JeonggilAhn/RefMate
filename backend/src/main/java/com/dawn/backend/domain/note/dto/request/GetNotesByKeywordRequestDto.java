package com.dawn.backend.domain.note.dto.request;

public record GetNotesByKeywordRequestDto(
	Long projectId,
	String keyword,
	String scopeType, // "BLUEPRINT" or "PIN"
	Long targetId     // blueprintVersionId or pinId depending on scopeType
) {
}
