package com.dawn.backend.global.util.uploader.dto.request;

import java.util.List;

public record NoteUploadRequestDto(
	Long projectId,
	List<FileUploadDetail> files
) { }
