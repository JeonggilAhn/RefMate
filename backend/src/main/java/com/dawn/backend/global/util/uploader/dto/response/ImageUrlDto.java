package com.dawn.backend.global.util.uploader.dto.response;

public record ImageUrlDto(
	String presignedUrl,
	String publicUrl
) {
	public static ImageUrlDto from(String presignedUrl, String publicUrl) {
		return new ImageUrlDto(presignedUrl, publicUrl);
	}
}
