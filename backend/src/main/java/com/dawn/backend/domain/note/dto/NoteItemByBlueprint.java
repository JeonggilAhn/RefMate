package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteItemByBlueprint(
	String type,
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	Boolean isBookmark,
	LocalDateTime createdAt,
	Boolean isPresentImage,
	List<ProjectUserDto> readUsers,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Long blueprintId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String blueprintTitle,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Long blueprintVersionId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String blueprintVersionPreviewImg,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Long pinId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinName,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Float pinX,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Float pinY,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Boolean isActive, // pin.isActive
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Long pinGroupId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinGroupName,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinGroupColor
) implements ChatItemDto {
	public static NoteItemByBlueprint from(
		NoteWithPinAndPinGroupDto dto,
		ProjectUserDto noteWriter,
		List<ProjectUserDto> readUsers
	) {
		return new NoteItemByBlueprint(
			"note",
			dto.noteId(),
			noteWriter,
			dto.noteTitle(),
			dto.isBookmark(),
			dto.createdAt(),
			dto.isPresentImage(),
			readUsers,
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
			dto.pinGroupColor()
		);
	}
}
