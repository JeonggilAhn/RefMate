package com.dawn.backend.domain.project.service;

import java.util.List;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.ProjectItemDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.InviteUserRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.dto.response.InviteUserResponseDto;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;

public interface ProjectService {

	List<ProjectItemDto> getProjectList(User user);

	List<ProjectUserDto> getProjectUsers(Long projectId);

	CreateProjectResponseDto createProject(User user, CreateProjectRequestDto createProjectRequestDto);

	InviteUserResponseDto inviteUser(Long projectId, InviteUserRequestDto request);

	void updateProject(Long projectId, UpdateProjectRequestDto request);

	void deleteProject(Long projectId);

	ProjectDto getProjectDetail(Long projectId);
}

