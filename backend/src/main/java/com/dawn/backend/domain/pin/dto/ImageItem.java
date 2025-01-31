package com.dawn.backend.domain.pin.dto;

public record ImageItem(
	String imageOrigin,
	String imagePreview,
	boolean isBookmark
) {
}
