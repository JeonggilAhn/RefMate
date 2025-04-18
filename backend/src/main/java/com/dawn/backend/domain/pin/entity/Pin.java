package com.dawn.backend.domain.pin.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pin extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pinId;

	private Float pinX;

	private Float pinY;

	private String pinName;

	private Boolean isDeleted;

	private LocalDateTime deletedAt;

	@Builder
	public Pin(
		Float pinX,
		Float pinY,
		String pinName
	) {
		this.pinX = pinX;
		this.pinY = pinY;
		this.pinName = pinName;
		this.isDeleted = false;
	}
}
