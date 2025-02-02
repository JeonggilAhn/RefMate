package com.dawn.backend.domain.project.service;

import java.util.List;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.InviteUserRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.dto.response.InviteUserResponseDto;
import com.dawn.backend.domain.user.dto.ProjectUserDto;

public interface ProjectService {

	ProjectDto getProjectDetail(Long projectId);

	void updateProject(Long projectId, UpdateProjectRequestDto request);

	void deleteProject(Long projectId);

	CreateProjectResponseDto createProject(Long userId, CreateProjectRequestDto createProjectRequestDto);

	List<ProjectUserDto> getProjectUsers(Long projectId);

	InviteUserResponseDto inviteUser(Long projectId, InviteUserRequestDto request);
}

