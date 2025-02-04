package com.dawn.backend.global.utils.uploader.dto.request;

import com.dawn.backend.global.utils.uploader.type.FileType;

public record BlueprintUploadRequestDto(
	Long userId,
	Long projectId,
	String fileName,
	FileType fileType,
	Long filesize,
	int fileX,
	int fileY
) { }
