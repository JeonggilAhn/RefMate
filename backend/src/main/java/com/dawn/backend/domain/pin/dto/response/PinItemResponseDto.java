package com.dawn.backend.domain.pin.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.pin.dto.PinGroupDto;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinVersion;

public record PinItemResponseDto(
	Long pinId,
	String pinName,
	Float pinX,
	Float pinY,
	List<ImageItem> previewImageList,
	Integer previewImageCount,
	PinGroupDto pinGroup,
	boolean isActive,
	List<Long> unreadNoteIds
) {
	public static PinItemResponseDto from(Pin pin, PinGroupDto pinGroupDto, PinVersion pinVersion, List<Long> unreadNoteIds) {
		return new PinItemResponseDto(
			pin.getPinId(),
			pin.getPinName(),
			pin.getPinX(),
			pin.getPinY(),
			new ArrayList<>(),
			0,
			pinGroupDto,
			pinVersion.getIsActive(),
			unreadNoteIds
		);
	}
}
