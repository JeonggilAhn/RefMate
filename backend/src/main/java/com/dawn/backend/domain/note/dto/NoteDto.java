package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.user.dto.ProjectUserDto;

public record NoteDto(
	Long noteId,
	ProjectUserDto noteWriter,
	String noteTitle,
	String noteContent,
	boolean isBookmark,
	List<ImageItem> imageList,
	LocalDateTime createdAt,
	boolean isEditable
) {
	public static NoteDto from(Note note, ProjectUserDto noteWriter, List<NoteImage> noteImages, boolean isEditable) {
		List<ImageItem> imageList = noteImages.stream()
			.map(ImageItem::from)
			.collect(Collectors.toList());

		return new NoteDto(
			note.getNoteId(),
			noteWriter,
			note.getNoteTitle(),
			note.getNoteContent(),
			note.getBookmark(),
			imageList,
			note.getCreatedAt(),
			isEditable
		);
	}
}
