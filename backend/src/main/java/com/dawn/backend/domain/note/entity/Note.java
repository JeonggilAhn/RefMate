package com.dawn.backend.domain.note.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
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

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long noteId;

	private String noteTitle;

	@Column(columnDefinition = "TEXT")
	private String noteContent;

	private Boolean bookmark;

	private Boolean isDeleted;

	private LocalDateTime deletedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "writer_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "blueprint_version_id")
	private BlueprintVersion blueprintVersion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pin_id")
	private Pin pin;

	@Builder
	public Note(
		String noteTitle,
		User user,
		String noteContent,
		BlueprintVersion blueprintVersion,
		Pin pin
	) {
		this.noteTitle = noteTitle;
		this.user = user;
		this.noteContent = noteContent;
		this.bookmark = false;
		this.isDeleted = false;
		this.blueprintVersion = blueprintVersion;
		this.pin = pin;
	}
}
