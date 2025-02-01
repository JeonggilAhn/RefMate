package com.dawn.backend.domain.pin.dto;

import java.util.List;

public record PinImageItem(
	Long noteId,
	String noteTitle,
	List<ImageItem> imageList
) {
}
