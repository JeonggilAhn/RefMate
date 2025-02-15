package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;

public record NoteWithPinAndPinGroupDto(
	Long writerId,
	String writerEmail,
	String writerProfileImage,
	Long noteId,
	String noteTitle,
	Boolean isBookmarked,
	LocalDateTime noteCreatedAt,
	Long blueprintId,
	String blueprintTitle,
	Long blueprintVersionId,
	String blueprintVersionPreviewImg,
	Long pinId,
	String pinName,
	Float pinX,
	Float pinY,
	Long pinGroupId,
	String pinGroupName,
	String pinGroupColor,
	Boolean isPresentImage
) {
}
