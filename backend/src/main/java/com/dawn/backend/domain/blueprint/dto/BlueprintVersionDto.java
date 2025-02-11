package com.dawn.backend.domain.blueprint.dto;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;

public record BlueprintVersionDto(
	Long blueprintVersionId,
	String blueprintVersionTitle,
	String blueprintImage,
	Integer blueprintVersionSeq
) {
	public static BlueprintVersionDto from(BlueprintVersion blueprintVersion) {
		return new BlueprintVersionDto(
			blueprintVersion.getBlueprintVersionId(),
			blueprintVersion.getBlueprintVersionName(),
			blueprintVersion.getBlueprintImg(),
			blueprintVersion.getBlueprintVersionSeq()
		);
	}
}
