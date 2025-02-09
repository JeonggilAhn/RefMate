package com.dawn.backend.domain.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.ProjectItemDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.InviteUserRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.service.ProjectService;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;

	@GetMapping("/projects")
	public ResponseEntity<ResponseWrapper<List<ProjectItemDto>>> getProjectList(
		@AuthenticationPrincipal User user
	) {
		List<ProjectItemDto> projectDtos = projectService.getProjectList(user);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectDtos);
	}

	@GetMapping("/projects/{projectId}/users")
	public ResponseEntity<ResponseWrapper<List<ProjectUserDto>>> getProjectUsers(
		@PathVariable("projectId") Long projectId
	) {
		List<ProjectUserDto> projectUserDtos = projectService.getProjectUsers(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectUserDtos);
	}

	@PostMapping("/projects")
	public ResponseEntity<ResponseWrapper<CreateProjectResponseDto>> createProject(
		@RequestBody CreateProjectRequestDto request,
		@AuthenticationPrincipal User user
	) {
		CreateProjectResponseDto createProjectResponseDto = projectService.createProject(user, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, createProjectResponseDto);
	}

	@PostMapping("/projects/{projectId}/users")
	@PreAuthorize("@authExpression.hasCreatorRoleInProject(#projectId)")
	public ResponseEntity<ResponseWrapper<Void>> inviteUser(
		@PathVariable("projectId") Long projectId,
		@RequestBody InviteUserRequestDto request
	) {
		projectService.inviteUser(projectId, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.CREATED, null, null);
	}

	@PatchMapping("/projects/{projectId}")
	@PreAuthorize("@authExpression.hasCreatorRoleInProject(#projectId)")
	public ResponseEntity<ResponseWrapper<Void>> updateProject(
		@PathVariable("projectId") Long projectId,
		@RequestBody UpdateProjectRequestDto request
	) {
		projectService.updateProject(projectId, request);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@DeleteMapping("/projects/{projectId}")
	@PreAuthorize("@authExpression.hasCreatorRoleInProject(#projectId)")
	public ResponseEntity<ResponseWrapper<Void>> deleteProject(
		@PathVariable("projectId") Long projectId
	) {
		projectService.deleteProject(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, null);
	}

	@GetMapping("/projects/{projectId}")
	public ResponseEntity<ResponseWrapper<ProjectDto>> getProjectDetail(@PathVariable("projectId") Long projectId) {
		ProjectDto projectDto = projectService.getProjectDetail(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectDto);
	}

}
