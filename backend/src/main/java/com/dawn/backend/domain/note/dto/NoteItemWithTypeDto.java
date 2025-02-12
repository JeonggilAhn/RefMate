package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinGroup;
import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteItemWithTypeDto(
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
	Long pinId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinName,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Float pinX,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Float pinY,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	Long pinGroupId,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinGroupName,
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String pinGroupColor
) implements ChatItemDto {
	public static NoteItemWithTypeDto fromForBlueprint(
		Note note,
		ProjectUserDto noteWriter,
		boolean isPresentImage,
		List<ProjectUserDto> readUsers,
		Pin pin,
		PinGroup pinGroup
	) {
		var blueprintVersion = note.getBlueprintVersion();
		var blueprint = blueprintVersion.getBlueprint();

		return new NoteItemWithTypeDto(
			"note",
			note.getNoteId(),
			noteWriter,
			note.getNoteTitle(),
			note.getBookmark(),
			note.getCreatedAt(),
			isPresentImage,
			readUsers,
			blueprint.getBlueprintId(),
			blueprint.getBlueprintTitle(),
			blueprintVersion.getBlueprintVersionId(),
			pin.getPinId(),
			pin.getPinName(),
			pin.getPinX(),
			pin.getPinY(),
			pinGroup.getPinGroupId(),
			pinGroup.getPinGroupName(),
			pinGroup.getPinGroupColor()
		);
	}

	public static NoteItemWithTypeDto fromForPin(
		Note note,
		ProjectUserDto noteWriter,
		boolean isPresentImage,
		List<ProjectUserDto> readUsers
	) {
		return new NoteItemWithTypeDto(
			"note",
			note.getNoteId(),
			noteWriter,
			note.getNoteTitle(),
			note.getBookmark(),
			note.getCreatedAt(),
			isPresentImage,
			readUsers,
			null,  // blueprintId
			null,  // blueprintTitle
			null,   // blueprintVersionId,
			null, // pinId
			null, // pinName
			null, // pinX
			null, // pinY
			null, // pinGroupId
			null, // pinGroupName
			null  // pinGroupColor
		);
	}
}
