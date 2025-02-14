package com.dawn.backend.domain.pin.dto.response;

public record UpdatePinGroupResponseDto(
	Long pinVersionId,
	Long pinGroupId,
	String pinGroupName,
	String pinGroupColor
) {
}
