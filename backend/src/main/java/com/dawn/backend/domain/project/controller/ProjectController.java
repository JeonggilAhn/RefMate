package com.dawn.backend.domain.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.service.ProjectService;
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
}
