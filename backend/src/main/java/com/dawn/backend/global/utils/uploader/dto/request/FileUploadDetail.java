package com.dawn.backend.global.utils.uploader.dto.request;

import com.dawn.backend.global.utils.uploader.type.FileType;

public record FileUploadDetail(
	String fileName,
	FileType fileType,
	Long filesize,
	int fileX,
	int fileY
) { }
