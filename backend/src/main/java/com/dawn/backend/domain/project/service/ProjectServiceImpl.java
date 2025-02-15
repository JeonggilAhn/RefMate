package com.dawn.backend.domain.project.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.exception.UserNotFoundException;
import com.dawn.backend.domain.user.exception.UserProjectNotFound;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.email.dto.EmailMessageRequestDto;
import com.dawn.backend.global.util.email.service.EmailService;
import com.dawn.backend.global.util.email.service.GrantService;

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
	private final EmailService emailService;
	private final GrantService grantService;

	// 리팩토링 해야함
	@Override
	public List<ProjectItemDto> getProjectList(User user) {

		List<UserProject> userProjects = userProjectRepository.findByUserId(user.getUserId());
		List<Long> projectIds = userProjects.stream()
			.map(up -> up.getProject().getProjectId())
			.collect(Collectors.toList());

		if (projectIds.isEmpty()) {
			return Collections.emptyList();
		}

		List<Project> projects = projectRepository.findByIdInAndIsDeletedFalse(projectIds);
		Map<Long, Boolean> isMineMap = userProjects.stream()
			.collect(Collectors.toMap(
				up -> up.getProject().getProjectId(),
				up -> "ROLE_OWNER".equals(up.getUserRole())
			));

		List<Blueprint> blueprints = blueprintRepository.findByProjectIdIn(projectIds);

		Map<Long, List<Blueprint>> blueprintMap = blueprints.stream()
			.collect(Collectors.groupingBy(
				bp -> bp.getProject().getProjectId(),
				Collectors.collectingAndThen(
					Collectors.toList(),
					list -> list.stream()
						.sorted(Comparator.comparing(Blueprint::getCreatedAt).reversed())
						.collect(Collectors.toList())
				)
			));

		List<Long> blueprintIds = blueprints.stream()
			.map(Blueprint::getBlueprintId)
			.collect(Collectors.toList());

		List<BlueprintVersion> blueprintVersions =
			blueprintVersionRepository.findLatestBlueprintVersionsByBlueprintIds(blueprintIds);

		Map<Long, List<BlueprintVersion>> latestBlueprintsMap = blueprintVersions.stream()
			.collect(Collectors.groupingBy(bv -> bv.getBlueprint().getBlueprintId()));

		return projects.stream().map(project -> {
			List<Blueprint> projectBlueprints =
				blueprintMap.getOrDefault(project.getProjectId(), Collections.emptyList());

			List<ProjectItemDto.PreviewImage> previewImages =
				projectBlueprints.stream()
					.map(bp -> {
						List<BlueprintVersion> versions =
							latestBlueprintsMap.getOrDefault(bp.getBlueprintId(), Collections.emptyList());
						if (!versions.isEmpty()) {
							BlueprintVersion latestVersion = versions.get(0);
							return new ProjectItemDto.PreviewImage(
								bp.getBlueprintTitle(),
								latestVersion.getPreviewImg(),
								bp.getBlueprintId(),
								latestVersion.getBlueprintVersionId()
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
				user.getUserId(),
				projectBlueprints.size()
			);
		}).collect(Collectors.toList());
	}

	@Override
	public List<ProjectUserDto> getProjectUsers(Long projectId) {
		validateProjectExists(projectId);
		List<ProjectUserDto> projectUserDtos = userProjectRepository.findProjectUsers(projectId)
			.stream()
			.map(ProjectUserDto::from)
			.toList();
		validateUserProjectExists(projectUserDtos, projectId);
		return projectUserDtos;
	}

	@Transactional
	@Override
	public CreateProjectResponseDto createProject(User user, CreateProjectRequestDto createProjectRequestDto) {
		Project project = createProjectRequestDto.toEntity();
		Project savedProject = projectRepository.save(project);
		saveUserProject(user, project, "ROLE_OWNER");
		return new CreateProjectResponseDto(
			ProjectItemDto.from(savedProject, user)
		);
	}

	@Transactional
	@Override
	public void inviteUser(Long projectId, InviteUserRequestDto request, User user) {
		Project project = getProject(projectId);
		String[] inviteUsersArray = request.inviteUserList().toArray(new String[0]);

		String userEmail = user.getUserEmail().split("@")[0];
		String mailSubject = "[RefMate] @" + userEmail + "님이 나를 " + project.getProjectTitle() + " 프로젝트에 초대했습니다.\n";

		EmailMessageRequestDto emailMessageRequestDto =
			new EmailMessageRequestDto(inviteUsersArray, mailSubject);
		String grantToken = grantService.createGrantToken(project.getProjectId(), "CLIENT");
		String unauthorizedGrantToken = grantService.createUnauthorizedGrantToken(project.getProjectId());
		log.info("grantToken UUID : {}", grantToken);
		log.info("unauthorizedGrantToken JWT : {}", unauthorizedGrantToken);
		emailService.sendMail(emailMessageRequestDto, project.getProjectTitle(),
			grantToken, unauthorizedGrantToken, projectId);
	}

	@Transactional
	@Override
	public void updateProject(Long projectId, UpdateProjectRequestDto request) {
		Project project = getProject(projectId);
		project.updateProjectTitle(request.projectTitle());
	}

	@Transactional
	@Override
	public void deleteProject(Long projectId) {
		Project project = getProject(projectId);
		userProjectRepository.findUserByProjectProjectId(projectId);
		project.deleteProject();
	}

	@Override
	public ProjectDto getProjectDetail(Long projectId) {
		Project project = getProject(projectId);
		return new ProjectDto(project.getProjectId(),
			project.getProjectTitle(),
			project.getCreatedAt());
	}

	private Project getProject(Long projectId) {
		return projectRepository.findById(projectId)
			.orElseThrow(ProjectNotFoundException::new);
	}

	private void saveUserProject(User user, Project project, String userRole) {
		UserProject userProject = UserProject.builder()
			.userRole(userRole)
			.user(user)
			.project(project)
			.build();
		UserProject savedUserProject = userProjectRepository.save(userProject);
	}

	private void validateProjectExists(Long projectId) {
		if (!projectRepository.existsById(projectId)) {
			throw new ProjectNotFoundException();
		}
	}

	private void validateUserProjectExists(List<ProjectUserDto> projectUserDtos, Long projectId) {
		if (projectUserDtos.isEmpty()) {
			log.info("해당 프로젝트에 속한 유저가 없습니다. projectId : {}", projectId);
			throw new UserProjectNotFound();
		}
	}

	private User getUserByUserEmail(String userEmail) {
		return userRepository.findByUserEmail(userEmail)
			.orElseThrow(UserNotFoundException::new);
	}


}
