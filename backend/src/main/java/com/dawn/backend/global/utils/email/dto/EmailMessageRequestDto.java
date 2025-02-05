package com.dawn.backend.global.utils.email.dto;

import lombok.Builder;

@Builder
public record EmailMessageRequestDto(
	String[] to,
	String subject,
	String message) {
}
