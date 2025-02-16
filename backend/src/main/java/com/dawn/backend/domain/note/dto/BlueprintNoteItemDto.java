package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;

public record BlueprintNoteItemDto(
	String type,
	Long userId,
	String userEmail,
	String profileUrl,
	Long noteId,
	String noteTitle,
	Boolean isBookmark,
	LocalDateTime createdAt,
	Boolean isPresentImage,
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
	String pinGroupColor
) implements ChatItemDto {
	public static BlueprintNoteItemDto from(
		NoteWithPinAndPinGroupDto dto
	) {
		return new BlueprintNoteItemDto(
			"note",
			dto.userId(),
			dto.userEmail(),
			dto.profileUrl(),
			dto.noteId(),
			dto.noteTitle(),
			dto.isBookmark(),
			dto.createdAt(),
			dto.isPresentImage(),
			dto.blueprintId(),
			dto.blueprintTitle(),
			dto.blueprintVersionId(),
			dto.blueprintVersionPreviewImg(),
			dto.pinId(),
			dto.pinName(),
			dto.pinX(),
			dto.pinY(),
			dto.pinGroupId(),
			dto.pinGroupName(),
			dto.pinGroupColor()
		);
	}
}
