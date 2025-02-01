package com.dawn.backend.domain.blueprint.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Blueprint extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long blueprintId;

	private String blueprintTitle;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id")
	private Project project;

	private Boolean isDeleted;

	private LocalDateTime deletedAt;

	@Builder
	public Blueprint(
		String blueprintTitle,
		Project project
	) {
		this.blueprintTitle = blueprintTitle;
		this.project = project;
		this.isDeleted = false;
	}
}
