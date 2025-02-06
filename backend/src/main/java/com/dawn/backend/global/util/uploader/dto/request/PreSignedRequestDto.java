package com.dawn.backend.global.util.uploader.dto.request;

import java.util.List;

public record PreSignedRequestDto(
	Long projectId,
	List<FileRequestDto> files
) { }
