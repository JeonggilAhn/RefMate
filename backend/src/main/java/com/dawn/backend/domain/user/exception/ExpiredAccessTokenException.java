package com.dawn.backend.domain.user.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.EXPIRED_ACCESS_TOKEN)
public class ExpiredAccessTokenException extends BaseRuntimeException {
}
