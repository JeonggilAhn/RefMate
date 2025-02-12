package com.dawn.backend.domain.blueprint.dto;

import java.time.LocalDateTime;

public record BlueprintDto(
	Long blueprintId,
	String blueprintTitle,
	String previewImage,
	LocalDateTime createdAt,
	Long latestVersionId
) {
}
