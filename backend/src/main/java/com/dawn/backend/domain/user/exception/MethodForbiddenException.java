package com.dawn.backend.domain.user.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.METHOD_FORBIDDEN)
public class MethodForbiddenException extends BaseRuntimeException {
}
