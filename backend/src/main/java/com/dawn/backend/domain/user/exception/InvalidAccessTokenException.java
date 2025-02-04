package com.dawn.backend.domain.user.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.INVALID_ACCESS_TOKEN)
public class InvalidAccessTokenException extends BaseRuntimeException {
}
