package com.dawn.backend.domain.blueprint.dto;

public record BlueprintDto(
	Long blueprintId,
	String blueprintTitle,
	String previewImage,
	String createdAt,
	Long latestVersionId
) {
}
