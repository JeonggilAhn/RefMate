package com.dawn.backend.domain.pin.dto;

import java.util.List;

import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinVersion;

public record PinItem(
	Long pinId,
	String pinName,
	Float pinX,
	Float pinY,
	List<ImageItem> previewImageList,
	Integer previewImageCount,
	PinGroupDto pinGroup,
	boolean hasUnreadNote,
	boolean isActive
) {
	public static PinItem from(Pin pin, PinGroupDto pinGroupDto, PinVersion pinVersion) {
		return new PinItem(
			pin.getPinId(),
			pin.getPinName(),
			pin.getPinX(),
			pin.getPinY(),
			null,
			0,
			pinGroupDto,
			false,
			pinVersion.getIsActive()
		);
	}
}
