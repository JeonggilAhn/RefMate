package com.dawn.backend.domain.pin.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.PIN_GROUP_UNAUTHORIZED)
public class PinGroupUnauthorizedException extends BaseRuntimeException {
}
