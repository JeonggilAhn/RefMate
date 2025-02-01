package com.dawn.backend.domain.project.service;

import com.dawn.backend.domain.project.dto.ProjectDto;

public interface ProjectService {
	// 프로젝트 상세 조회
	ProjectDto getProjectDetail(Long projectId);
}
