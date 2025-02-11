package com.dawn.backend.domain.pin.dto.request;

public record CreatePinRequestDto(
	Float pinX,
	Float pinY,
	String pinName,
	Long pinGroupId
) {
}
