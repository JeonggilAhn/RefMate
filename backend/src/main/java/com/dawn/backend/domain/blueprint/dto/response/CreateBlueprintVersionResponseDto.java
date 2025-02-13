package com.dawn.backend.domain.blueprint.dto.response;

import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;

public record CreateBlueprintVersionResponseDto(
	BlueprintVersionItem blueprintVersion
) {
}
