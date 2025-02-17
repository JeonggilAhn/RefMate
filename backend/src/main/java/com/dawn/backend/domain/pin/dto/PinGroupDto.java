package com.dawn.backend.domain.pin.dto;

import com.dawn.backend.domain.pin.entity.PinGroup;

public record PinGroupDto(
	Long pinGroupId,
	String pinGroupName,
	String pinGroupColor,
	String pinGroupColorLight
) {
	public static PinGroupDto from(PinGroup pinGroup) {
		return new PinGroupDto(
			pinGroup.getPinGroupId(),
			pinGroup.getPinGroupName(),
			pinGroup.getPinGroupColor(),
			pinGroup.getPinGroupColorLight()
		);
	}
}

