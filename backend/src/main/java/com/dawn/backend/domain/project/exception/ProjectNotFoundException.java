package com.dawn.backend.domain.project.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.PROJECT_NOT_FOUND)
public class ProjectNotFoundException extends BaseRuntimeException {
}
