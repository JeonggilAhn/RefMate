package com.dawn.backend.domain.pin.dto;

import com.dawn.backend.domain.note.entity.NoteImage;

public record ImageItem(
	Long imageId,
	String imageOrigin,
	String imagePreview,
	boolean isBookmark
) {
	public static ImageItem from(NoteImage noteImage) {
		return new ImageItem(
			noteImage.getImageId(),
			noteImage.getImageOrigin(),
			noteImage.getImagePreview(),
			noteImage.getBookmark()
		);
	}
}
