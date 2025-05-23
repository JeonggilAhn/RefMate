package com.dawn.backend.domain.pin.entity;

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

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.global.jpa.base.BaseTimeEntity;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PinGroup extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pinGroupId;

	private String pinGroupName;

	private String pinGroupColor;

	private String pinGroupColorLight;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "blueprint_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Blueprint blueprint;

	@Builder
	public PinGroup(
		String pinGroupName,
		String pinGroupColor,
		String pinGroupColorLight,
		Blueprint blueprint
	) {
		this.pinGroupName = pinGroupName;
		this.pinGroupColor = pinGroupColor;
		this.pinGroupColorLight = pinGroupColorLight;
		this.blueprint = blueprint;
	}
}
