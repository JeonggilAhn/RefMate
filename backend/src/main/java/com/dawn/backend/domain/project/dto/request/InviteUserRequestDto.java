package com.dawn.backend.domain.project.dto.request;

import java.util.List;

public record InviteUserRequestDto(
	List<String> inviteUserList
) {
}
