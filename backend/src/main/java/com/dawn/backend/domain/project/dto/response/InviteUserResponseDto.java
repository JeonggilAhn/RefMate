package com.dawn.backend.domain.project.dto.response;

import java.util.List;

public record InviteUserResponseDto(
	List<Long> invitedUserList
) {
}
