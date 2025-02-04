package com.dawn.backend.global.utils.uploader.dto.response;

import com.dawn.backend.domain.note.entity.Note;

public record NoteFileUploadResponseDto(
	String presignedUrl,
	String publicUrl
) {
	public static NoteFileUploadResponseDto from(String presignedUrl, String publicUrl) {
		return new NoteFileUploadResponseDto(presignedUrl, publicUrl);
	}
}
