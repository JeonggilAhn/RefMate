package com.dawn.backend.domain.user.dto;

import java.time.LocalDateTime;

public record ProjectUserDto(
	Long userId,
	String userEmail,
	String profileUrl,
	LocalDateTime signupDate,
	LocalDateTime resignDate,
	String role
) {
}
