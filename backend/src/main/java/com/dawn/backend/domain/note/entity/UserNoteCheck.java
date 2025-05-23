package com.dawn.backend.domain.note.entity;

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
import lombok.Setter;

import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Table(
	uniqueConstraints = {
		@UniqueConstraint(name = "unique_user_note", columnNames = {"user_id", "note_id"})
	}
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserNoteCheck extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long noteCheckId;

	private Boolean isChecked;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "note_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Note note;

	@Builder
	public UserNoteCheck(
		User user,
		Note note
	) {
		this.isChecked = false;
		this.user = user;
		this.note = note;
	}

	public void updateNoteCheck(Boolean isChecked) {
		this.isChecked = isChecked;
	}
}
