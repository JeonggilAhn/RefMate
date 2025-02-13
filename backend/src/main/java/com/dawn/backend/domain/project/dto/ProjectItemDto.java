package com.dawn.backend.domain.project.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.user.entity.User;

public record ProjectItemDto(
	Long projectId,
	String projectTitle,
	LocalDateTime createdAt,
	List<PreviewImage> previewImages,
	boolean isMine,
	Long ownerId,
	Integer blueprintsCount
) {

	public static ProjectItemDto from(Project project, User user) {
		return new ProjectItemDto(
			project.getProjectId(),
			project.getProjectTitle(),
			project.getCreatedAt(),
			new ArrayList<>(),
			true,
			user.getUserId(),
			0
		);
	}

	public record PreviewImage(
		String blueprintTitle,
		String previewImage
	) {
	}
}
