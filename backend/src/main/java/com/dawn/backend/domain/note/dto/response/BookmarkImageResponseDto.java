package com.dawn.backend.domain.note.dto.response;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;

public record BookmarkImageResponseDto(
	Long imageId,
	Long nodeId,
	boolean bookmark
) {
	public static BookmarkImageResponseDto from(NoteImage noteImage) {
		return new BookmarkImageResponseDto(
			noteImage.getImageId(),
			noteImage.getNote().getNoteId(),
			noteImage.getBookmark()
		);
	}
}
