package com.dawn.backend.global.util.uploader.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.config.MinioConfig;
import com.dawn.backend.domain.user.dto.CustomOAuth2User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.global.util.uploader.dto.request.BlueprintUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.request.FileUploadDetail;
import com.dawn.backend.global.util.uploader.dto.request.NoteUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.response.BlueprintUploadResponseDto;
import com.dawn.backend.global.util.uploader.dto.response.NoteFileUploadResponseDto;
import com.dawn.backend.global.util.uploader.dto.response.NoteUploadResponseDto;
import com.dawn.backend.global.util.uploader.exception.InvalidBlueprintFileTypeException;
import com.dawn.backend.global.util.uploader.exception.InvalidNoteFileTypeException;
import com.dawn.backend.global.util.uploader.exception.PresignedUrlGenerationFailException;
import com.dawn.backend.global.util.uploader.exception.UploadPermissionDeniedException;
import com.dawn.backend.global.util.uploader.type.FileType;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;
	private final MinioConfig minioConfig;
	private final UserProjectRepository userProjectRepository;

	public BlueprintUploadResponseDto  generateBlueprintPresignedUrl(
		BlueprintUploadRequestDto dto,
		CustomOAuth2User loginUser
	) {
		validatePermission(loginUser.getUser().getUserId(), dto.projectId());
		validateFileTypeForBlueprint(dto.fileType());
		String objectName = generateUploadPath(dto.userId(), dto.projectId(), dto.fileName());
		String presignedUrl = generatePresignedUrl(objectName);
		String publicUrl = generatePublicUrl(objectName);
		return BlueprintUploadResponseDto.from(presignedUrl, publicUrl);
	}

	public NoteUploadResponseDto generateNotePresignedUrls(
		NoteUploadRequestDto dto,
		CustomOAuth2User loginUser
	) {
		validatePermission(loginUser.getUser().getUserId(), dto.projectId());
		List<NoteFileUploadResponseDto> fileResponses = new ArrayList<>();
		for (FileUploadDetail file : dto.files()) {
			validateFileTypeForNote(file.fileType());
			String objectName = generateUploadPath(dto.userId(), dto.projectId(), file.fileName());
			String presignedUrl = generatePresignedUrl(objectName);
			String publicUrl = generatePublicUrl(objectName);
			fileResponses.add(NoteFileUploadResponseDto.from(presignedUrl, publicUrl));
		}
		return NoteUploadResponseDto.from(fileResponses);
	}

	private void validateFileTypeForBlueprint(FileType fileType) {
		if (!List.of(FileType.PNG, FileType.JPG, FileType.PDF, FileType.DWG).contains(fileType)) {
			throw new InvalidBlueprintFileTypeException();
		}
	}

	private void validateFileTypeForNote(FileType fileType) {
		if (!List.of(FileType.PNG, FileType.JPG).contains(fileType)) {
			throw new InvalidNoteFileTypeException();
		}
	}

	private void validatePermission(Long userId, Long projectId) {
		boolean hasPermission = userProjectRepository.findByUserIdAndProjectId(userId, projectId).isPresent();

		if (!hasPermission) {
			throw new UploadPermissionDeniedException();
		}
	}

	private String generateUploadPath(Long userId, Long projectId, String fileName) {
		return String.format("%d/%d/%s_%s",
			userId,
			projectId,
			UUID.randomUUID(),
			fileName);
	}

	private String generatePresignedUrl(String objectName) {
		try {
			return minioClient.getPresignedObjectUrl(
				GetPresignedObjectUrlArgs.builder()
					.bucket(minioConfig.getBucketName())
					.object(objectName)
					.method(Method.PUT)
					.expiry(60 * 10)
					.build());
		} catch (Exception e) {
			throw new PresignedUrlGenerationFailException();
		}
	}

	private String generatePublicUrl(String objectName) {
		return String.format("%s/%s/%s", minioConfig.getUrl(), minioConfig.getBucketName(), objectName);
	}
}
