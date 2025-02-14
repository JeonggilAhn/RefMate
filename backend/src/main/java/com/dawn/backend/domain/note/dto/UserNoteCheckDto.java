package com.dawn.backend.domain.note.dto;

import com.dawn.backend.domain.note.entity.UserNoteCheck;

public record UserNoteCheckDto(
	Long userId,
	String username,
	Boolean isRead
) {
	public static UserNoteCheckDto from(UserNoteCheck userNoteCheck) {
		return new UserNoteCheckDto(
			userNoteCheck.getUser().getUserId(),
			userNoteCheck.getUser().getUserName(),
			userNoteCheck.getIsChecked()
		);
	}
}
