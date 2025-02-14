package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.dawn.backend.domain.note.entity.UserNoteCheck;

public record BlueprintNoteItemDto(
	String type,
	Long noteId,
	Long noteWriterId,
	String noteTitle,
	Boolean isBookmarked,
	LocalDateTime noteCreatedAt,
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
			dto.noteId(),
			dto.writerId(),
			dto.noteTitle(),
			dto.isBookmarked(),
			dto.noteCreatedAt(),
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
