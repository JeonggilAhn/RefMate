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
import com.dawn.backend.global.util.uploader.dto.request.BlueprintUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.request.FileUploadDetail;
import com.dawn.backend.global.util.uploader.dto.request.NoteUploadRequestDto;
import com.dawn.backend.global.util.uploader.dto.response.BlueprintUploadResponseDto;
import com.dawn.backend.global.util.uploader.dto.response.NoteFileUploadResponseDto;
import com.dawn.backend.global.util.uploader.dto.response.NoteUploadResponseDto;
import com.dawn.backend.global.util.uploader.type.FileType;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;
	private final MinioConfig minioConfig;

	public BlueprintUploadResponseDto  generateBlueprintPresignedUrl(BlueprintUploadRequestDto dto) {
//		validatePermission(dto.userId(), dto.projectId());
		validateFileTypeForBlueprint(dto.fileType());
		String objectName = generateUploadPath(dto.userId(), dto.projectId(), dto.fileName());
		String presignedUrl = generatePresignedUrl(objectName);
		String publicUrl = generatePublicUrl(objectName);
		return BlueprintUploadResponseDto.from(presignedUrl, publicUrl);
	}

	public NoteUploadResponseDto generateNotePresignedUrls(NoteUploadRequestDto dto) {
//		validatePermission(dto.userId(), dto.projectId());
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
			throw new IllegalArgumentException("Invalid file type for Blueprint");
		}
	}

	private void validateFileTypeForNote(FileType fileType) {
		if (!List.of(FileType.PNG, FileType.JPG).contains(fileType)) {
			throw new IllegalArgumentException("Only PNG/JPG allowed for Notes");
		}
	}

//	private void validatePermission(Long userId, Long projectId) {
//		// 추후 projectId와 userId로 user_project테이블에서 해당 프로젝트에 사진을 올릴 권한이 있는제 체크하는 로직 추가
//	}

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
			throw new RuntimeException("Presigned URL 생성 실패", e);
		}
	}

	private String generatePublicUrl(String objectName) {
		return String.format("%s/%s/%s", minioConfig.getUrl(), minioConfig.getBucketName(), objectName);
	}
}
