package com.dawn.backend.domain.pin.dto;

import java.util.List;

public record PinItem(
	Long pinId,
	String pinName,
	Integer pinX,
	Integer pinY,
	List<ImageItem> previewImageList,
	Integer previewImageCount,
	PinGroupDto pinGroup,
	boolean hasUnreadNote,
	boolean isActive
) {
}
