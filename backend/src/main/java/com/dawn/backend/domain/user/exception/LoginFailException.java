package com.dawn.backend.domain.user.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.FAIL_TO_LOGIN)
public class LoginFailException extends BaseRuntimeException {
}
