package com.dawn.backend.global.util.uploader.dto.request;

import com.dawn.backend.global.util.uploader.type.FileType;

public record BlueprintUploadRequestDto(
	Long userId,
	Long projectId,
	String fileName,
	FileType fileType,
	Long filesize,
	int fileX,
	int fileY
) { }
