package com.dawn.backend.global.util.uploader.dto.response;

import java.util.List;

public record PreSignedResponseDto(
	List<ImageUrlDto> files
) {
	public static PreSignedResponseDto from(List<ImageUrlDto> files) {
		return new PreSignedResponseDto(files);
	}
}
