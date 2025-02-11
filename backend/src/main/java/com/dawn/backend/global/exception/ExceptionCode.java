package com.dawn.backend.global.exception;

import org.springframework.http.HttpStatus;

import com.dawn.backend.global.response.ResponseCode;

public enum ExceptionCode implements ResponseCode {
	// User
	INVALID_ACCESS_TOKEN("user-401-1", "올바르지 않은 토큰입니다", HttpStatus.UNAUTHORIZED),
	EXPIRED_ACCESS_TOKEN("user-401-2", "토큰의 유효기간이 만료되었습니다", HttpStatus.UNAUTHORIZED),
	FAIL_TO_LOGIN("user-401-3", "로그인에 실패했습니다", HttpStatus.UNAUTHORIZED),
	METHOD_UNAUTHORIZED("user-401-4", "API에 접근하기 위해서 인증이 필요합니다", HttpStatus.UNAUTHORIZED),
	METHOD_FORBIDDEN("user-403-1", "API에 접근하기 위한 권한이 부족합니다", HttpStatus.FORBIDDEN),
	USER_NOT_FOUND("user-404-1", "해당 사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	USER_ALREADY_EXISTS("user-400-1", "이미 존재하는 사용자입니다", HttpStatus.BAD_REQUEST),

	// Project
	PROJECT_NOT_FOUND("project-404-1", "해당 프로젝트를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	PROJECT_ALREADY_EXISTS("project-400-1", "이미 존재하는 프로젝트입니다", HttpStatus.BAD_REQUEST),
	PROJECT_UNAUTHORIZED("project-403-1", "프로젝트에 접근하기 위한 권한이 없습니다", HttpStatus.FORBIDDEN),

	// UserProject
	USER_PROJECT_NOT_FOUND("user_project-404-1", "해당 사용자 프로젝트를 찾을 수 없습니다", HttpStatus.NOT_FOUND),

	// Blueprint
	BLUEPRINT_NOT_FOUND("blueprint-404-1", "해당 블루프린트를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	BLUEPRINT_ALREADY_EXISTS("blueprint-400-1", "이미 존재하는 블루프린트입니다", HttpStatus.BAD_REQUEST),
	BLUEPRINT_UNAUTHORIZED("blueprint-403-1", "블루프린트에 접근하기 위한 권한이 없습니다", HttpStatus.FORBIDDEN),

	//BlueprintVersion
	BLUEPRINT_VERSION_NOT_FOUND("blueprint_version-404-1", "해당 블루프린트 버전을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	BLUEPRINT_VERSION_ALREADY_EXISTS("blueprint_version-400-1", "이미 존재하는 블루프린트 버전입니다", HttpStatus.BAD_REQUEST),
	BLUEPRINT_VERSION_UNAUTHORIZED("blueprint_version-403-1", "블루프린트 버전에 접근하기 위한 권한이 없습니다", HttpStatus.FORBIDDEN),
	// BLUEPRINT_VERSION_INVALID("blueprint_version-400-2", "올바르지 않은 블루프린트 버전입니다", HttpStatus.BAD_REQUEST),

	// Pin
	PIN_NOT_FOUND("pin-404-1", "해당 핀을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	PIN_ALREADY_EXISTS("pin-400-1", "이미 존재하는 핀입니다", HttpStatus.BAD_REQUEST),
	PIN_UNAUTHORIZED("pin-403-1", "핀에 접근하기 위한 권한이 없습니다.", HttpStatus.FORBIDDEN),

	// PinVersion
	PIN_VERSION_NOT_FOUND("pin_version-404-1", "해당 핀 버전을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	PIN_VERSION_ALREADY_EXISTS("pin_version-400-1", "이미 존재하는 핀 버전입니다", HttpStatus.BAD_REQUEST),
	ACTIVE_PIN_VERSION_NOT_FOUND("pin_version-404-2", "활성화된 핀 버전을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	PIN_VERSION_BY_NOTE_NOT_FOUND("pin_version-404-3", "노트와 연결된 핀 버전을 찾을 수 없습니다", HttpStatus.NOT_FOUND),

	// PinGroup
	PIN_GROUP_NOT_FOUND("pin_group-404-1", "해당 핀 그룹을 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	PIN_GROUP_ALREADY_EXISTS("pin_group-400-1", "이미 존재하는 핀 그룹입니다", HttpStatus.BAD_REQUEST),
	PIN_GROUP_UNAUTHORIZED("pin_group-403-1", "핀 그룹에 접근하기 위한 권한이 없습니다.", HttpStatus.FORBIDDEN),

	// Note
	NOTE_NOT_FOUND("note-404-1", "해당 노트를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
	NOTE_ALREADY_EXISTS("note-400-1", "이미 존재하는 노트입니다", HttpStatus.BAD_REQUEST),
	NOTE_UNAUTHORIZED("note-403-1", "노트에 접근하기 위한 권한이 없습니다.", HttpStatus.FORBIDDEN),
	NOTE_TITLE_MISSING("note-400-2", "노트 제목을 입력하지 않았습니다.", HttpStatus.BAD_REQUEST),
	UNREAD_NOTE_NOT_FOUND("note-404-2", "해당 핀에 대해 읽지 않은 노트가 없습니다.", HttpStatus.NOT_FOUND),
	NOTE_BY_PIN_NOT_FOUND("note-404-3", "해당 핀에 노트가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
	BOOKMARK_NOTE_NOT_FOUND("note-404-4", "해당 핀에 즐겨찾기된 노트가 없습니다.", HttpStatus.NOT_FOUND),
	NOTE_BY_BLUEPRINT_VERSION_NOT_FOUND("note-404-5", "해당 블루프린트 버전에 노트가 없습니다.", HttpStatus.NOT_FOUND),
	RECENT_NOTE_NOT_FOUND("note-404-6", "해당 핀에 최근 작성된 노트가 없습니다.", HttpStatus.NOT_FOUND),
	DELETED_NOTE("note-404-7", "삭제된 노트입니다.", HttpStatus.NOT_FOUND),
	NOTE_EDIT_TIME_EXCEEDED("note-400-3", "5분 이후에는 노트를 수정할 수 없습니다.", HttpStatus.BAD_REQUEST),
	NOTE_DELETE_FORBIDDEN("note-403-2", "노트를 삭제할 권한이 없습니다.", HttpStatus.FORBIDDEN),

	// Image
	IMAGE_NOT_FOUND("image-404-1", "해당 이미지가 없습니다.", HttpStatus.NOT_FOUND),
	// IMAGE_NOT_FOUND_BY_PIN("image-404-2", "해당 핀과 연결된 이미지가 없습니다.", HttpStatus.NOT_FOUND);

	// File
	INVALID_BLUEPRINT_FILE_TYPE("file-400-1", "블루프린트에 허용되지 않은 파일 형식입니다. ", HttpStatus.BAD_REQUEST),
	INVALID_NOTE_FILE_TYPE("file-400-2", "노트에 허용되지 않은 파일 형식입니다. ", HttpStatus.BAD_REQUEST),
	UPLOAD_PERMISSION_DENIED("file-403-3", "프로젝트에 파일 업로드 권한이 없습니다", HttpStatus.FORBIDDEN),
	PRESIGNED_URL_GENERATION_FAILED("file-500-1", "Presigned URL 생성에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	// Email
	EMAIL_SEND_FAILED("email-500-1", "이메일 전송에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	EMAIL_TEMPLATE_READ_FAILED("email-500-2", "이메일 템플릿을 읽는데 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	// Grant
	INVALID_GRANT_TOKEN("grant-400-1", "유효하지 않은 초대 토큰입니다.", HttpStatus.BAD_REQUEST),
	INVALID_UNAUTHORIZED_GRANT_TOKEN("grant-400-2", "유효하지 않은 비회원 초대 토큰입니다.", HttpStatus.BAD_REQUEST);

	private String code;
	private String message;
	private HttpStatus status;

	ExceptionCode(String code, String message, HttpStatus status) {
		this.code = code;
		this.message = message;
		this.status = status;
	}

	@Override
	public String getCode() {
		return this.code;
	}

	@Override
	public String getMessage() {
		return this.message;
	}

	@Override
	public HttpStatus getHttpStatus() {
		return this.status;
	}
}
