package com.dawn.backend.global.util.uploader.dto.request;

import com.dawn.backend.global.util.uploader.type.FileType;

public record FileUploadDetail(
	String fileName,
	FileType fileType,
	Long filesize,
	int fileX,
	int fileY
) { }
