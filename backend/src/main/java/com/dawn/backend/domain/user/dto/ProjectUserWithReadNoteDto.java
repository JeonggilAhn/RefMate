package com.dawn.backend.domain.user.dto;

import java.time.LocalDateTime;

public record ProjectUserWithReadNoteDto(
	Long userId,
	String userEmail,
	String profileUrl,
	LocalDateTime signupDate,
	String role,
	Long noteId
) {
}

