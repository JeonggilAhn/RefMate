package com.dawn.backend.domain.project.service;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;

public interface ProjectService {

	ProjectDto getProjectDetail(Long projectId);

	void updateProject(Long projectId, UpdateProjectRequestDto request);

}
