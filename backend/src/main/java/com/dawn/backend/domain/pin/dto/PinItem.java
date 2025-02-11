package com.dawn.backend.domain.pin.dto;

import java.util.List;

public record PinItem(
	Long pinId,
	String pinName,
	Float pinX,
	Float pinY,
	List<ImageItem> imageList,
	Integer imageCount,
	PinGroupDto pinGroup,
	boolean hasUnreadNote,
	boolean isActive
) {
}
