package com.dawn.backend.global.exception;

import org.springframework.http.HttpStatus;

import com.dawn.backend.global.response.ResponseCode;

public enum ExceptionCode implements ResponseCode {
	INVALID_ACCESS_TOKEN("user-401-1", "올바르지 않은 토큰입니다", HttpStatus.UNAUTHORIZED),
	EXPIRED_ACCESS_TOKEN("user-401-2", "토큰의 유효기간이 만료되었습니다", HttpStatus.UNAUTHORIZED),
	FAIL_TO_LOGIN("user-401-3", "로그인에 실패했습니다", HttpStatus.UNAUTHORIZED),
	METHOD_UNAUTHORIZED("user-401-4", "API에 접근하기 위해서 인증이 필요합니다", HttpStatus.UNAUTHORIZED),
	METHOD_FORBIDDEN("user-403-1", "API에 접근하기 위한 권한이 부족합니다", HttpStatus.FORBIDDEN),
	USER_NOT_FOUND("user-404-1", "해당 사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),;

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
