package com.dawn.backend.domain.note.dto.response;

import java.util.List;

import com.dawn.backend.domain.note.dto.ChatItemDto;

public record GetNotesByKeywordResponseDto(
	Long centerNoteId,
	boolean hasMoreBefore, // 신규(앞) 쪽 더보기 여부: center note보다 최신인 노트가 더 있는지
	boolean hasMoreAfter,  // 구형(뒤) 쪽 더보기 여부: center note보다 오래된 노트가 더 있는지
	List<ChatItemDto> noteList
) {
	public static GetNotesByKeywordResponseDto from(
		Long centerNoteId, boolean hasMoreBefore, boolean hasMoreAfter, List<ChatItemDto> noteList
	) {
		return new GetNotesByKeywordResponseDto(centerNoteId, hasMoreBefore, hasMoreAfter, noteList);
	}
}
