package com.dawn.backend.global.util.authorize;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintNotFound;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.exception.NoteNotFoundException;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;

@Component
public class AuthExpression {
	private final UserProjectRepository userProjectRepository;
	private final NoteRepository noteRepository;
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;
	private final PinVersionRepository pinVersionRepository;

	@Autowired
	public AuthExpression(
			UserProjectRepository userProjectRepository,
			NoteRepository noteRepository,
			BlueprintRepository blueprintRepository,
			BlueprintVersionRepository blueprintVersionRepository,
			PinVersionRepository pinVersionRepository) {
		this.userProjectRepository = userProjectRepository;
		this.noteRepository = noteRepository;
		this.blueprintRepository = blueprintRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
		this.pinVersionRepository = pinVersionRepository;
	}

	public boolean isSelf(Long userId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return user.getUserId().equals(userId);
	}

	public boolean hasProjectPermission(Long projectId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), projectId).isPresent();
	}

	public boolean isNoteWriter(Long noteId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Note note = noteRepository.findById(noteId).orElseThrow(NoteNotFoundException::new);
		return note.getUser().equals(user);
	}

	public boolean hasBlueprintPermission(Long blueprintId) {
		Blueprint blueprint =
			blueprintRepository.findById(blueprintId).orElseThrow(BlueprintNotFound::new);

		return hasProjectPermission(blueprint.getProject().getProjectId());
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

	public boolean hasCreatorRoleInProject(Long projectId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userProjectRepository.existsByUserUserIdAndProjectProjectIdAndUserRole(
			user.getUserId(), projectId, "CREATOR");
	}
}
