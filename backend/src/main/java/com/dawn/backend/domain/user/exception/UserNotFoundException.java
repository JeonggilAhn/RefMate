package com.dawn.backend.domain.user.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.USER_NOT_FOUND)
public class UserNotFoundException extends BaseRuntimeException {
}
