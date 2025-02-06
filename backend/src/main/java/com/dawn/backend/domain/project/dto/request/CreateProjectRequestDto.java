package com.dawn.backend.domain.project.dto.request;

import com.dawn.backend.domain.project.entity.Project;

public record CreateProjectRequestDto(
	String projectTitle
) {
	public Project toEntity() {
		return new Project(this.projectTitle, null);
	}
}
