package com.dawn.backend.domain.blueprint.dto.request;

public record CreateBlueprintVersionRequestDto(
	String blueprintVersionName,
	String originFile
) {
}
