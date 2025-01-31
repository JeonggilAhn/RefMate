package com.dawn.backend.domain.user.dto;

public record ProjectUserDto(
	Long userId,
	String userEmail,
	String profileUrl,
	String signupDate,
	String resignDate,
	String role
) {
}
