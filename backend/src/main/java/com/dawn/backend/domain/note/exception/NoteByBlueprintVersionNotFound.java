package com.dawn.backend.domain.note.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.NOTE_BY_BLUEPRINT_VERSION_NOT_FOUND)
public class NoteByBlueprintVersionNotFound extends BaseRuntimeException {
}
