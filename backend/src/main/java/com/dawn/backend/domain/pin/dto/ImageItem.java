package com.dawn.backend.domain.pin.dto;

public record ImageItem(
	Long imageId,
	String imageOrigin,
	String imagePreview,
	boolean isBookmark
) {
}
