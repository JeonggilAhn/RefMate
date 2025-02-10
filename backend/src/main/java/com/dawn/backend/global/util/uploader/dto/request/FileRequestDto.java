package com.dawn.backend.global.util.uploader.dto.request;

public record FileRequestDto(
	String fileName,
	String fileType,
	Long filesize,
	int fileX,
	int fileY
) { }
