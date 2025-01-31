package com.dawn.backend.domain.project.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.dawn.backend.domain.base.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long projectId;

	private String projectTitle;

	private String previewImg;

	private Boolean isDeleted;

	private LocalDateTime deletedAt;

	@Builder
	public Project(
		String projectTitle,
		String previewImg
	) {
		this.projectTitle = projectTitle;
		this.previewImg = previewImg;
		this.isDeleted = false;
	}
}
