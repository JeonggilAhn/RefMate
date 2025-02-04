package com.dawn.backend.domain.user.dto;

import java.time.LocalDateTime;

import com.dawn.backend.domain.user.entity.User;

public record ProjectUserDto(
	Long userId,
	String userEmail,
	String profileUrl,
	LocalDateTime signupDate,
	LocalDateTime resignDate,
	String role
) {
	public static ProjectUserDto from(User user, String role) {
		return new ProjectUserDto(
			user.getUserId(),
			user.getUserEmail(),
			user.getProfileImage(),
			user.getCreatedAt(),   // BaseTimeEntity 상속 필드
			user.getResignDate(),
			role
		);
	}
}
