package com.dawn.backend.global.util.uploader.dto.response;

public record BlueprintUploadResponseDto(
	String presignedUrl,
	String publicUrl
) {
	public static BlueprintUploadResponseDto from(String presignedUrl, String publicUrl) {
		return new BlueprintUploadResponseDto(presignedUrl, publicUrl);
	}
}
