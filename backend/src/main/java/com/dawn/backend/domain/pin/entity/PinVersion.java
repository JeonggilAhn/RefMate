package com.dawn.backend.domain.pin.entity;

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

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PinVersion extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pinVersionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "blueprint_version_id")
	private BlueprintVersion blueprintVersion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pin_id")
	private Pin pin;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pin_group_id")
	private PinGroup pinGroup;

	private Boolean isActive;

	private String pinGroupName;

	@Builder
	public PinVersion(
		BlueprintVersion blueprintVersion,
		Pin pin,
		PinGroup pinGroup,
		String pinGroupName
	) {
		this.blueprintVersion = blueprintVersion;
		this.pin = pin;
		this.pinGroup = pinGroup;
		this.isActive = true;
		this.pinGroupName = pinGroupName;
	}
}
