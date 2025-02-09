package com.dawn.backend.global.util.authorize;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintNotFoundException;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.exception.NoteNotFoundException;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;

@Component
public class AuthExpression {
	private final UserProjectRepository userProjectRepository;
	private final NoteRepository noteRepository;
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;
	private final PinVersionRepository pinVersionRepository;
	private final ProjectRepository projectRepository;

	@Autowired
	public AuthExpression(
			UserProjectRepository userProjectRepository,
			NoteRepository noteRepository,
			BlueprintRepository blueprintRepository,
			BlueprintVersionRepository blueprintVersionRepository,
			PinVersionRepository pinVersionRepository,
			ProjectRepository projectRepository
	) {
		this.userProjectRepository = userProjectRepository;
		this.noteRepository = noteRepository;
		this.blueprintRepository = blueprintRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
		this.pinVersionRepository = pinVersionRepository;
		this.projectRepository = projectRepository;
	}

	public boolean isSelf(Long userId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return user.getUserId().equals(userId);
	}

	public boolean hasProjectPermissionByProjectId(Long projectId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), projectId).isPresent();
	}

	public boolean isNoteWriter(Long noteId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Note note = noteRepository.findById(noteId).orElseThrow(NoteNotFoundException::new);
		return note.getUser().getUserId().equals(user.getUserId());
	}

	public boolean hasProjectPermissionByNoteId(Long noteId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Project project = projectRepository.findByNoteId(noteId)
			.orElseThrow(ProjectNotFoundException::new);
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), project.getProjectId()).isPresent();
	}

	public boolean hasProjectPermissionByImageId(Long imageId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Project project = projectRepository.findByImageId(imageId)
			.orElseThrow(ProjectNotFoundException::new);
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), project.getProjectId()).isPresent();
	}

	public boolean hasProjectPermissionByPinId(Long pinId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Project project = projectRepository.findByPinId(pinId)
			.orElseThrow(ProjectNotFoundException::new);
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), project.getProjectId()).isPresent();
	}

	public boolean hasProjectPermissionByBlueprintId(Long blueprintId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Project project = projectRepository.findByBlueprintId(blueprintId)
			.orElseThrow(ProjectNotFoundException::new);
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), project.getProjectId()).isPresent();
	}

	public boolean hasBlueprintPermission(Long blueprintId) {
		Blueprint blueprint =
			blueprintRepository.findById(blueprintId).orElseThrow(BlueprintNotFoundException::new);

		return hasProjectPermissionByProjectId(blueprint.getProject().getProjectId());
	}

	public boolean hasBlueprintVersionPermission(Long versionId) {
		BlueprintVersion blueprintVersion =
			blueprintVersionRepository.findById(versionId).orElseThrow();

		return hasBlueprintPermission(blueprintVersion.getBlueprint().getBlueprintId());
	}

	public boolean hasPinPermission(Long pinId) {
		PinVersion pinVersion =
			pinVersionRepository.findFirstByPinPinId(pinId);

		return hasBlueprintPermission(pinVersion.getBlueprintVersion().getBlueprint().getBlueprintId());
	}

	public boolean hasRoleOwnerInProject(Long projectId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userProjectRepository.existsByUserUserIdAndProjectProjectIdAndUserRole(
			user.getUserId(), projectId, "ROLE_OWNER");
	}
}
