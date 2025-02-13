package com.dawn.backend.domain.pin.dto.response;

import com.dawn.backend.domain.pin.dto.PinItem;

public record CreatePinResponseDto(
	PinItem pin
) {
}
