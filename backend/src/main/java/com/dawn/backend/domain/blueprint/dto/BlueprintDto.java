package com.dawn.backend.domain.blueprint.dto;

import java.time.LocalDateTime;

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;

public record BlueprintDto(
	Long blueprintId,
	String blueprintTitle,
	String previewImage,
	LocalDateTime createdAt,
	Long latestVersionId
) {
	public static BlueprintDto from(Blueprint blueprint, BlueprintVersion latestVersion) {
		return new BlueprintDto(
			blueprint.getBlueprintId(),
			blueprint.getBlueprintTitle(),
			latestVersion.getPreviewImg(),
			blueprint.getCreatedAt(),
			latestVersion.getBlueprintVersionId()
		);
	}
}
