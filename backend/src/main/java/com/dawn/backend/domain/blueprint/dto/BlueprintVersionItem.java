package com.dawn.backend.domain.blueprint.dto;

import java.time.LocalDateTime;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;

public record BlueprintVersionItem(
	Long blueprintVersionId,
	String blueprintVersionName,
	String previewImage,
	LocalDateTime createdAt,
	Integer blueprintVersionSeq
) {
	public static BlueprintVersionItem from(BlueprintVersion blueprintVersion) {
		return new BlueprintVersionItem(
			blueprintVersion.getBlueprintVersionId(),
			blueprintVersion.getBlueprintVersionName(),
			blueprintVersion.getPreviewImg(),
			blueprintVersion.getCreatedAt(),
			blueprintVersion.getBlueprintVersionSeq()
		);
	}
}
