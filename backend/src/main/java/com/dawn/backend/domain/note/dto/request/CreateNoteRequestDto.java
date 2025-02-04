package com.dawn.backend.domain.note.dto.request;

import java.util.List;

public record CreateNoteRequestDto(
	Long blueprintVersionId,
	Long projectId,
	String noteTitle,
	String noteContent,
	List<String> imageUrlList
) {
}
