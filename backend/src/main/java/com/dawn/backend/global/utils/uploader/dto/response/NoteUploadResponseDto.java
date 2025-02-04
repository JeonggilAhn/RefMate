package com.dawn.backend.global.utils.uploader.dto.response;

import java.util.List;

public record NoteUploadResponseDto(
	List<NoteFileUploadResponseDto> files
) {
	public static NoteUploadResponseDto from(List<NoteFileUploadResponseDto> files) {
		return new NoteUploadResponseDto(files);
	}
}
