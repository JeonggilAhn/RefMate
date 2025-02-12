package com.dawn.backend.domain.project.dto.response;

import com.dawn.backend.domain.project.entity.Project;

public record CreateProjectResponseDto(
	Project project
) {
}
