package com.dawn.backend.domain.project.dto;

public record ProjectDto(
	Long projectId,
	String projectTitle,
	String createdAt
) {
}
