package com.dawn.backend.domain.user.dto;

public record UserDto(
	Long userId,
	String userEmail,
	String profileUrl,
	String signupDate,
	String resignDate
) {
}
