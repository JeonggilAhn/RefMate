package com.dawn.backend.domain.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.ProjectItemDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.InviteUserRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.dto.response.InviteUserResponseDto;
import com.dawn.backend.domain.project.service.ProjectService;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;

	@GetMapping("/projects/{projectId}")
	public ResponseEntity<ResponseWrapper<ProjectDto>> getProjectDetail(@PathVariable("projectId") Long projectId) {
		ProjectDto projectDto = projectService.getProjectDetail(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectDto);
	}

	@PatchMapping("/projects/{projectId}")
	public ResponseEntity<ResponseWrapper<Void>> updateProject(
		@PathVariable("projectId") Long projectId,
		@RequestBody UpdateProjectRequestDto request
	) {
		projectService.updateProject(projectId, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@DeleteMapping("/projects/{projectId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteProject(
		@PathVariable("projectId") Long projectId) {
		projectService.deleteProject(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	// userId 는 accesstoken 으로 대체 예정
	@PostMapping("/projects")
	public ResponseEntity<ResponseWrapper<CreateProjectResponseDto>> createProject(
		@RequestBody CreateProjectRequestDto request
	) {
		CreateProjectResponseDto createProjectResponseDto = projectService.createProject(1L, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, createProjectResponseDto);
	}

	@GetMapping("/projects/{projectId}/users")
	public ResponseEntity<ResponseWrapper<List<ProjectUserDto>>> getProjectUsers(
		@PathVariable("projectId") Long projectId
	) {
		List<ProjectUserDto> projectUserDtos = projectService.getProjectUsers(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectUserDtos);
	}

	@PostMapping("/projects/{projectId}/users")
	public ResponseEntity<ResponseWrapper<InviteUserResponseDto>> inviteUser(
		@PathVariable("projectId") Long projectId,
		@RequestBody InviteUserRequestDto request
	) {
		InviteUserResponseDto inviteUserResponseDto = projectService.inviteUser(projectId, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, inviteUserResponseDto);
	}

	@GetMapping("/projects")
	public ResponseEntity<ResponseWrapper<List<ProjectItemDto>>> getProjectList(
		@RequestParam("userId") Long userId
	) {
		List<ProjectItemDto> projectDtos = projectService.getProjectList(userId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectDtos);
	}
}
