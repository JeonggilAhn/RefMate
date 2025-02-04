package com.dawn.backend.domain.project.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectItemDto(
	Long projectId,
	String projectTitle,
	LocalDateTime createdAt,
	List<PreviewImage> previewImages,
	boolean isMine,
	Long ownerId,
	Integer blueprintsCount
) {
	public record PreviewImage(
		String blueprintTitle,
		String previewImage
	) {
	}
}
