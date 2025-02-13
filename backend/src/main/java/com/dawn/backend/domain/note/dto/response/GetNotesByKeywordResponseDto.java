package com.dawn.backend.domain.note.dto.response;

import java.util.List;

public record GetNotesByKeywordResponseDto(
	List<Long> matchedNoteIdList
) {
	public static GetNotesByKeywordResponseDto from(
		List<Long> matchedNoteIdList
	) {
		return new GetNotesByKeywordResponseDto(matchedNoteIdList);
	}
}
