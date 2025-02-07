package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.dawn.backend.domain.note.entity.Note;
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
	Long blueprintVersionId
) implements ChatItemDto {
	public static NoteItemWithTypeDto fromForBlueprint(
		Note note,
		ProjectUserDto noteWriter,
		boolean isPresentImage,
		List<ProjectUserDto> readUsers
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
			blueprintVersion.getBlueprintVersionId()
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
			null   // blueprintVersionId
		);
	}
}
