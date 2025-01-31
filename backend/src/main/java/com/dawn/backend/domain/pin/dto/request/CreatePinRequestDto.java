package com.dawn.backend.domain.pin.dto.request;

public record CreatePinRequestDto(
	Integer pinX,
	Integer pinY,
	String pinName,
	Long pinGroupId
) {
}
