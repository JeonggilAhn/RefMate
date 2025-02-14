package com.dawn.backend.global.jpa.base;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTimeEntity extends BaseCreatedTimeEntity {
	private static final ZoneId seoul = ZoneId.of("Asia/Seoul");

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@PrePersist
	public void prePersist() {
		if (updatedAt == null) {
			updatedAt = LocalDateTime.now(seoul);
		}
	}
}
