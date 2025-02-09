package com.dawn.backend.domain.note.dto;

import java.time.LocalDateTime;

public record DateSeparatorDto(
	String type,
	String date
) implements ChatItemDto {
	public static DateSeparatorDto from(LocalDateTime date) {
		return new DateSeparatorDto("date-separator", date.toString());
	}
}
