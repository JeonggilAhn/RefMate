package com.dawn.backend.domain.project.dto.response;

import com.dawn.backend.domain.project.dto.ProjectItemDto;

public record CreateProjectResponseDto(
	ProjectItemDto project
) {
}
