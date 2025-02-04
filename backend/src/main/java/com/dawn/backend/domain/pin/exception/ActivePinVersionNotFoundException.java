package com.dawn.backend.domain.pin.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.ACTIVE_PIN_VERSION_NOT_FOUND)
public class ActivePinVersionNotFoundException extends BaseRuntimeException {
}
