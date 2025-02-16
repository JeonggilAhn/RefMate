package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.dawn.backend.domain.user.dto.ProjectUserDto;

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
	Boolean isActive,
	Long pinGroupId,
	String pinGroupName,
	String pinGroupColor,
	List<ProjectUserDto> readUsers
) implements ChatItemDto {
	public static BlueprintNoteItemDto from(
		NoteWithPinAndPinGroupDto dto,
		List<ProjectUserDto> readUsers
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
			dto.isActive(),
			dto.pinGroupId(),
			dto.pinGroupName(),
			dto.pinGroupColor(),
			readUsers
		);
	}
}
