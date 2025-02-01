package com.dawn.backend.domain.project.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.repository.ProjectRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;

	@Override
	public ProjectDto getProjectDetail(Long projectId) {
		Project project = projectRepository.findById(projectId)
			.orElseThrow(() -> new RuntimeException(HttpStatus.INTERNAL_SERVER_ERROR.toString()));
		return new ProjectDto(project.getProjectId(),
			project.getProjectTitle(),
			project.getCreatedAt());
	}
}
