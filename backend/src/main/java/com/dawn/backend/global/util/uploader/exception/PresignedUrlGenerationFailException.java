package com.dawn.backend.global.util.uploader.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.PRESIGNED_URL_GENERATION_FAILED)
public class PresignedUrlGenerationFailException extends BaseRuntimeException {
}
