package com.dawn.backend.global.util.uploader.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;
import com.dawn.backend.global.util.uploader.dto.request.PreSignedRequestDto;
import com.dawn.backend.global.util.uploader.dto.response.PreSignedResponseDto;
import com.dawn.backend.global.util.uploader.service.UploadService;

@RestController
@RequiredArgsConstructor
public class UploadController {

	private final UploadService uploadService;

	/**
	 * login 로직 완료 되면 추후 수정
	 * dto - user_id 삭제
	 * service - 기존 dto에서 가져오던 user_id로직 수정
	 */

	@PreAuthorize("@authExpression.hasProjectPermissionByProjectId(#requestBody.projectId())")
	@PostMapping("/uploads/pre-signed-url")
	public ResponseEntity<ResponseWrapper<PreSignedResponseDto>> getBlueprintPreSignedUrl(
		@RequestBody PreSignedRequestDto requestBody
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			uploadService.generateImageUrls(requestBody)
		);
	}
}
