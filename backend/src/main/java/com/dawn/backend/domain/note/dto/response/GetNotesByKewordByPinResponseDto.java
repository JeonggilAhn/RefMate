package com.dawn.backend.domain.note.dto.response;

import java.util.List;

public record GetNotesByKewordByPinResponseDto(
	List<Long> noteIdList
) {
	public static GetNotesByKewordByPinResponseDto from(
		List<Long> noteIdList
	) {
		return new GetNotesByKewordByPinResponseDto(noteIdList);
	}
}
