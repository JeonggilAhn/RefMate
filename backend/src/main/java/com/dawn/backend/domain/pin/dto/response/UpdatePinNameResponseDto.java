package com.dawn.backend.domain.pin.dto.response;

public record UpdatePinNameResponseDto(
	Long pinId,
	String pinName
) {
}
