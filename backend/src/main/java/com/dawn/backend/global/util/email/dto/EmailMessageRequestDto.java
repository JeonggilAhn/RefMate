package com.dawn.backend.global.util.email.dto;

import lombok.Builder;

@Builder
public record EmailMessageRequestDto(
	String[] to,
	String subject,
	String message) {
}
