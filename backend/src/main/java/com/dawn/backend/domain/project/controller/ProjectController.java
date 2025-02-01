package com.dawn.backend.domain.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.service.ProjectService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;

	// 프로젝트 상세 조회
	@GetMapping("/projects/{project_id}")
	public ResponseEntity<ResponseWrapper<ProjectDto>> getProjectDetail(@PathVariable("project_id") Long projectId) {
		ProjectDto projectDto = projectService.getProjectDetail(projectId);
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, null, projectDto);
	}
}
