package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;

public record NoteWithPinAndPinGroupDto(
	Long userId,
	String userEmail,
	String profileUrl,
	Long noteId,
	String noteTitle,
	Boolean isBookmark,
	LocalDateTime createdAt,
	Long blueprintId,
	String blueprintTitle,
	Long blueprintVersionId,
	String blueprintVersionPreviewImg,
	Long pinId,
	String pinName,
	Float pinX,
	Float pinY,
	Boolean isActive,
	Long pinGroupId,
	String pinGroupName,
	String pinGroupColor,
	Boolean isPresentImage
) {
}
