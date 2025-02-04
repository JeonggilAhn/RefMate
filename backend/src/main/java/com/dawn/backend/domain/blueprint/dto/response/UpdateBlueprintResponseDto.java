package com.dawn.backend.domain.blueprint.dto.response;

public record UpdateBlueprintResponseDto(
	Long blueprintId,
	String blueprintTitle
) {
}
