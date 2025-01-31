package com.dawn.backend.domain.pin.dto;

import java.util.List;

public record PinImageItem(
	String noteId,
	String noteTitle,
	List<ImageItem> imageList
) {
}
