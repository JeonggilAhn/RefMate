package com.dawn.backend.domain.project.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final UserProjectRepository userProjectRepository;

	@Override
	public ProjectDto getProjectDetail(Long projectId) {
		Project project = projectRepository.findById(projectId)
			.orElseThrow(() -> new RuntimeException(HttpStatus.INTERNAL_SERVER_ERROR.toString()));
		return new ProjectDto(project.getProjectId(),
			project.getProjectTitle(),
			project.getCreatedAt());
	}

	@Transactional
	@Override
	public void updateProject(Long projectId, UpdateProjectRequestDto request) {
		Project project = projectRepository.findById(projectId)
			.orElseThrow(() -> new IllegalArgumentException(HttpStatus.INTERNAL_SERVER_ERROR.toString()));
		project.updateProjectTitle(request.projectTitle());
	}

	@Transactional
	@Override
	public void deleteProject(Long projectId) {
		Project project = projectRepository.findById(projectId)
			.orElseThrow(() -> new IllegalArgumentException(HttpStatus.INTERNAL_SERVER_ERROR.toString()));
		project.deleteProject();
	}

	@Transactional
	@Override
	public CreateProjectResponseDto createProject(Long userId, CreateProjectRequestDto createProjectRequestDto) {
		Project project = Project.builder()
			.projectTitle(createProjectRequestDto.projectTitle())
			.previewImg(null)
			.build();

		Project savedProject = projectRepository.save(project);

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException(HttpStatus.INTERNAL_SERVER_ERROR.toString()));

		UserProject userProject = UserProject.builder()
			.userRole("CREATOR")
			.user(user)
			.project(project)
			.build();

		userProjectRepository.save(userProject);

		return new CreateProjectResponseDto(savedProject.getProjectId());

	}

	@Override
	public List<ProjectUserDto> getProjectUsers(Long projectId) {
		return userProjectRepository.findProjectUsers(projectId);
	}
}
