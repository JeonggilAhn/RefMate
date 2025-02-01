package com.dawn.backend.domain.project.service;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;

public interface ProjectService {

	ProjectDto getProjectDetail(Long projectId);

	void updateProject(Long projectId, UpdateProjectRequestDto request);

	void deleteProject(Long projectId);
	
	CreateProjectResponseDto createProject(Long userId, CreateProjectRequestDto createProjectRequestDto);
}

