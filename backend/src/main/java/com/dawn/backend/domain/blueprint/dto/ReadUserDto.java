package com.dawn.backend.domain.blueprint.dto;

import com.dawn.backend.domain.user.dto.UserDto;

public record ReadUserDto(
	Long noteId,
	UserDto userDto
) {
}
