package com.dawn.backend.domain.blueprint.dto.request;

public record CreateBlueprintRequestDto(
	String blueprintTitle,
	String originFile
) {
}
