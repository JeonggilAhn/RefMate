package com.dawn.backend.global.exception;

import org.springframework.http.HttpStatus;

import com.dawn.backend.global.response.ResponseCode;

public enum ExceptionCode implements ResponseCode {
	USER_NOT_FOUND("user-400-1", "해당 사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),;

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
