package com.dawn.backend.domain.note.dto;

import java.util.List;

import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteDto(
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	String noteContent,
	boolean isBookmark,
	List<ImageItem> imageList,
	String createdAt
) {
}
