package com.dawn.backend.domain.note.dto.request;

import java.util.List;

public record CreateNoteRequestDto(
	String noteTitle,
	String noteContent,
	List<String> imageUrlList,
	Long pinGroupId
) {
}
