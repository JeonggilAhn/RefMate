package com.dawn.backend.domain.project.dto;

import java.time.LocalDateTime;

public record ProjectDto(
	Long projectId,
	String projectTitle,
	LocalDateTime createdAt
) {
}
