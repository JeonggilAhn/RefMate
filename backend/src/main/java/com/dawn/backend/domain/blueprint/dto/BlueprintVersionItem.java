package com.dawn.backend.domain.blueprint.dto;

public record BlueprintVersionItem(
	Long blueprintVersionId,
	String blueprintVersionName,
	String previewImage,
	String createdAt,
	Integer blueprintVersionSeq
) {
}
