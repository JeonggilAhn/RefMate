package com.dawn.backend.domain.pin.dto.response;

public record UpdatePinStatusResponseDto(
	Long pinVersionId,
	boolean isActive
) {
}
