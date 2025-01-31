package com.dawn.backend.domain.blueprint.entity;

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

import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlueprintVersion extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long blueprintVersionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "blueprint_id")
	private Blueprint blueprint;

	private String blueprintVersionName;

	private String originFile;

	private String blueprintImg;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pre_blueprint_version_id")
	private BlueprintVersion preBlueprintVersion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "post_blueprint_version_id")
	private BlueprintVersion postBlueprintVersion;

	private String previewImg;

	private int blueprintVersionSeq;

	@Builder
	public BlueprintVersion(
		Long blueprintVersionId,
		Blueprint blueprint,
		String blueprintVersionName,
		String originFile,
		String blueprintImg,
		BlueprintVersion preBlueprintVersion,
		BlueprintVersion postBlueprintVersion,
		String previewImg,
		int blueprintVersionSeq
	) {
		this.blueprint = blueprint;
		this.blueprintVersionName = blueprintVersionName;
		this.originFile = originFile;
		this.blueprintImg = blueprintImg;
		this.preBlueprintVersion = preBlueprintVersion;
		this.postBlueprintVersion = postBlueprintVersion;
		this.previewImg = previewImg;
		this.blueprintVersionSeq = blueprintVersionSeq;
	}
}
