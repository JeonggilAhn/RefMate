package com.dawn.backend.domain.blueprint.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.BLUEPRINT_NOT_FOUND)
public class BlueprintNotFound extends BaseRuntimeException {
}
