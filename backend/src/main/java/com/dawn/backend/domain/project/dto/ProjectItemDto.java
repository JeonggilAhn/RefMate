package com.dawn.backend.domain.project.dto;

import java.util.List;

public record ProjectItemDto(
	Long projectId,
	String projectTitle,
	String createdAt,
	List<PreviewImage> previewImages,
	boolean includeUnreadNotes,
	boolean isMine,
	Long ownerId,
	Long blueprintsCount
) {
	public record PreviewImage(
		String blueprintTitle,
		String previewImage
	) {
	}
}
