package com.dawn.backend.domain.note.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(
	name = "note",
	indexes = {
		@Index(
			name = "idx_note_pinid_isdeleted_createdat_noteid",
			columnList = "pin_id, created_at, note_id"
			),
		@Index(
			name = "idx_note_blueprintversionid_isdeleted_createdat_noteid",
			columnList = "blueprint_version_id, is_deleted, created_at, note_id"
			)
	}
)
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
	@JoinColumn(name = "writer_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "blueprint_version_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private BlueprintVersion blueprintVersion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pin_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
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

	public void deleteNote() {
		this.isDeleted = true;
		this.deletedAt = LocalDateTime.now();
	}

	public void updateNoteTitle(String newTitle) {
		this.noteTitle = newTitle;
	}

	public void updateNoteContent(String newContent) {
		this.noteContent = newContent;
	}

	public void addBookmark() {
		bookmark = true;
	}

	public void removeBookmark() {
		bookmark = false;
	}
}
