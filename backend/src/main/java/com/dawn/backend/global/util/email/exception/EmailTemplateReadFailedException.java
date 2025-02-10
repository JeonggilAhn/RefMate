package com.dawn.backend.global.util.email.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.EMAIL_TEMPLATE_READ_FAILED)
public class EmailTemplateReadFailedException extends BaseRuntimeException {
}
