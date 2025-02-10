package com.dawn.backend.global.util.uploader.service;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.Result;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.config.MinioConfig;
import com.dawn.backend.global.util.uploader.dto.ImagePathDto;
import com.dawn.backend.global.util.uploader.dto.request.FileRequestDto;
import com.dawn.backend.global.util.uploader.dto.request.PreSignedRequestDto;
import com.dawn.backend.global.util.uploader.dto.response.ImageUrlDto;
import com.dawn.backend.global.util.uploader.dto.response.PreSignedResponseDto;
import com.dawn.backend.global.util.uploader.exception.InvalidNoteFileTypeException;
import com.dawn.backend.global.util.uploader.exception.PresignedUrlGenerationFailException;
import com.dawn.backend.global.util.uploader.type.FileType;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;
	private final MinioConfig minioConfig;

	public PreSignedResponseDto generateImageUrls(PreSignedRequestDto requestBody) {
		List<ImageUrlDto> fileResponses = new ArrayList<>();
		for (FileRequestDto file : requestBody.files()) {
//			validateFileType(file.fileType());
			String objectName = generateObjectPath(requestBody.projectId(), file.fileType());
			String preSignedUrl = generatePreSignedUrl(objectName);
			String publicUrl = generatePublicUrl(objectName);
			fileResponses.add(ImageUrlDto.from(preSignedUrl, publicUrl));
		}
		return PreSignedResponseDto.from(fileResponses);
	}

	private void validateFileType(FileType fileType) {
		if (!List.of(FileType.PNG, FileType.JPG, FileType.PDF, FileType.DWG).contains(fileType)) {
			throw new InvalidNoteFileTypeException();
		}
	}

	private String generateObjectPath(Long projectId, FileType fileType) {
		return String.format("%d/%s/%s.%s",
			projectId,
			UUID.randomUUID(),
			UUID.randomUUID(),
			fileType.toString().toLowerCase());
	}

	private String generatePreSignedUrl(String objectName) {
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

	public ImagePathDto getImagePath(String originFilePath) {

		originFilePath = originFilePath.substring(
			minioConfig.getUrl().length() + minioConfig.getBucketName().length() + 2,
			originFilePath.lastIndexOf("/") + 1
		);

		Iterable<Result<Item>> objects = minioClient.listObjects(
			ListObjectsArgs.builder()
				.bucket(minioConfig.getBucketName())
				.prefix(originFilePath)
				.build()
		);

		String imageUrl = null;
		String previewImgUrl = null;

		for (Result<Item> object : objects) {
			Item item;

			try {
				item = object.get();
			} catch (Exception e) {
				throw new RuntimeException(e);
			}

			if (item.objectName().matches(".*_preview\\.webp$")) {
				previewImgUrl = generatePublicUrl(item.objectName());
			} else if (item.objectName().matches(".*\\.(png|jpg)$")) {
				imageUrl = generatePublicUrl(item.objectName());
			}
		}

		return new ImagePathDto(imageUrl, previewImgUrl);
	}
}
