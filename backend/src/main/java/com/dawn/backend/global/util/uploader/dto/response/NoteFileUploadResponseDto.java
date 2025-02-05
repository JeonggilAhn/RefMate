package com.dawn.backend.global.util.uploader.dto.response;

public record NoteFileUploadResponseDto(
	String presignedUrl,
	String publicUrl
) {
	public static NoteFileUploadResponseDto from(String presignedUrl, String publicUrl) {
		return new NoteFileUploadResponseDto(presignedUrl, publicUrl);
	}
}
