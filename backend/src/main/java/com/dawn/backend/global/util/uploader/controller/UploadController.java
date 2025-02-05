package com.dawn.backend.global.util.uploader.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.user.dto.CustomOAuth2User;
import com.dawn.backend.global.util.uploader.dto.request.BlueprintUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.request.NoteUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.response.BlueprintUploadResponseDto;
import com.dawn.backend.global.util.uploader.dto.response.NoteUploadResponseDto;
import com.dawn.backend.global.util.uploader.service.UploadService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/uploads/presigned-url")
public class UploadController {

	private final UploadService uploadService;

	/**
	 * login 로직 완료 되면 추후 수정
	 * dto - user_id 삭제
	 * service - 기존 dto에서 가져오던 user_id로직 수정
	 */

	@PostMapping("/blueprint")
	public ResponseEntity<?> getBlueprintPresignedUrl(
		@RequestBody BlueprintUploadRequestDto dto,
		@AuthenticationPrincipal CustomOAuth2User loginUser
		) {
		try {
			BlueprintUploadResponseDto response = uploadService.generateBlueprintPresignedUrl(dto, loginUser);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("Presigned URL 생성 실패: " + e.getMessage());
		}
	}

	@PostMapping("/note")
	public ResponseEntity<?> getNotePresignedUrls(
		@RequestBody NoteUploadRequestDto dto,
		@AuthenticationPrincipal CustomOAuth2User loginUser
	) {
		try {
			NoteUploadResponseDto response = uploadService.generateNotePresignedUrls(dto, loginUser);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("Presigned URL 생성 실패: " + e.getMessage());
		}
	}

}
