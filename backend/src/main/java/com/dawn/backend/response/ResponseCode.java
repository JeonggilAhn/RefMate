package com.dawn.backend.response;

import org.springframework.http.HttpStatus;

public interface ResponseCode {
	String getCode();

	String getMessage();

	HttpStatus getHttpStatus();
}
