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
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoteImage extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long imageId;

	private String imageOrigin;

	private String imagePreview;

	private Boolean bookmark;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "note_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Note note;

	@Builder
	public NoteImage(
		String imageOrigin,
		String imagePreview,
		Note note
	) {
		this.imageOrigin = imageOrigin;
		this.imagePreview = imagePreview;
		this.bookmark = false;
		this.note = note;
	}

	public void addBookmark() {
		bookmark = true;
	}

	public void removeBookmark() {
		bookmark = false;
	}
}
