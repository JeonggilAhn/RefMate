package com.dawn.backend.domain.project.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.project.dto.ProjectDto;
import com.dawn.backend.domain.project.dto.ProjectItemDto;
import com.dawn.backend.domain.project.dto.request.CreateProjectRequestDto;
import com.dawn.backend.domain.project.dto.request.InviteUserRequestDto;
import com.dawn.backend.domain.project.dto.request.UpdateProjectRequestDto;
import com.dawn.backend.domain.project.dto.response.CreateProjectResponseDto;
import com.dawn.backend.domain.project.dto.response.InviteUserResponseDto;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	private final UserProjectRepository userProjectRepository;
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;

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
	public CreateProjectResponseDto createProject(User user, CreateProjectRequestDto createProjectRequestDto) {
		Project project = Project.builder()
			.projectTitle(createProjectRequestDto.projectTitle())
			.previewImg(null)
			.build();

		Project savedProject = projectRepository.save(project);

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

	@Transactional
	@Override
	public InviteUserResponseDto inviteUser(Long projectId, InviteUserRequestDto request) {
		Project project = projectRepository.findById(projectId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

		System.out.println("request.inviteUserList() : " + request.inviteUserList());

		List<Long> invitedUserIds = new ArrayList<>();

		for (String userEmail : request.inviteUserList()) {
			User user = userRepository.findByUserEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

			if (userProjectRepository.existsByUserAndProject(user, project)) {
				log.info("이미 해당 프로젝트에 속해있는 유저입니다. userId : {}", user.getUserId());
				continue;
			}

			UserProject userProject = UserProject.builder()
				.userRole("MEMBER")
				.user(user)
				.project(project)
				.build();

			userProjectRepository.save(userProject);
			invitedUserIds.add(user.getUserId());
		}

		return new InviteUserResponseDto(invitedUserIds);
	}

	@Override
	public List<ProjectItemDto> getProjectList(Long userId) {

		List<UserProject> userProjects = userProjectRepository.findByUserId(userId);
		List<Long> projectIds = userProjects.stream()
			.map(up -> up.getProject().getProjectId())
			.collect(Collectors.toList());

		if (projectIds.isEmpty()) {
			return Collections.emptyList();
		}

		List<Project> projects = projectRepository.findByIdIn(projectIds);
		Map<Long, Boolean> isMineMap = userProjects.stream()
			.collect(Collectors.toMap(
				up -> up.getProject().getProjectId(),
				up -> "CREATOR".equals(up.getUserRole())
			));

		List<Blueprint> blueprints = blueprintRepository.findByProjectIdIn(projectIds);
		Map<Long, List<Blueprint>> blueprintMap = blueprints.stream()
			.collect(Collectors.groupingBy(bp -> bp.getProject().getProjectId()));

		List<Long> blueprintIds = blueprints.stream()
			.map(Blueprint::getBlueprintId)
			.collect(Collectors.toList());

		// 4. 블루프린트 최신 버전 조회 (최신순)
		List<BlueprintVersion> blueprintVersions =
			blueprintVersionRepository.findLatestBlueprintVersionsByBlueprintIds(blueprintIds);

		// 5. 블루프린트 ID 기준으로 최신 버전 매핑
		Map<Long, List<BlueprintVersion>> latestBlueprintsMap = blueprintVersions.stream()
			.collect(Collectors.groupingBy(bv -> bv.getBlueprint().getBlueprintId()));

		// 6. 프로젝트 데이터 조합하여 DTO 생성
		return projects.stream().map(project -> {
			List<Blueprint> projectBlueprints =
				blueprintMap.getOrDefault(project.getProjectId(), Collections.emptyList());

			// 최신 블루프린트 버전 4개만 선택
			List<ProjectItemDto.PreviewImage> previewImages =
				projectBlueprints.stream()
					.map(bp -> {
						List<BlueprintVersion> versions =
							latestBlueprintsMap.getOrDefault(bp.getBlueprintId(), Collections.emptyList());
						if (!versions.isEmpty()) {
							BlueprintVersion latestVersion = versions.get(0);
							return new ProjectItemDto.PreviewImage(
								bp.getBlueprintTitle(),
								latestVersion.getPreviewImg()
							);
						}
						return null;
					})
					.filter(Objects::nonNull)
					.limit(4)
					.collect(Collectors.toList());

			return new ProjectItemDto(
				project.getProjectId(),
				project.getProjectTitle(),
				project.getCreatedAt(),
				previewImages,
				isMineMap.getOrDefault(project.getProjectId(), false),
				userId,
				projectBlueprints.size()
			);
		}).collect(Collectors.toList());
	}
}
