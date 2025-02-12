package com.dawn.backend.domain.blueprint.dto;

import java.time.LocalDateTime;

public record BlueprintVersionItem(
	Long blueprintVersionId,
	String blueprintVersionName,
	String previewImage,
	LocalDateTime createdAt,
	Integer blueprintVersionSeq
) {
}
