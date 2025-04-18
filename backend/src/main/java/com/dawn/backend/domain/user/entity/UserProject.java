package com.dawn.backend.domain.user.entity;

import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.dawn.backend.domain.project.entity.Project;

@Entity
@Table(
	uniqueConstraints = {
		@UniqueConstraint(name = "unique_user_project", columnNames = {"user_id", "project_id"})
	}
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserProject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userProjectId;

	private String userRole;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Project project;

	@Builder
	public UserProject(
		String userRole,
		User user,
		Project project
	) {
		this.userRole = userRole;
		this.user = user;
		this.project = project;
	}
}
