package com.dawn.backend.domain.blueprint.dto;

public record BlueprintVersionDto(
	Long blueprintVersionId,
	String blueprintVersionTitle,
	String blueprintImage
) {
}
