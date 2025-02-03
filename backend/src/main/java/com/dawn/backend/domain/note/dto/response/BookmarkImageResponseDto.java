package com.dawn.backend.domain.note.dto.response;

public record BookmarkImageResponseDto(
	Long imageId,
	Long nodeId,
	Integer bookmark
) {
}
