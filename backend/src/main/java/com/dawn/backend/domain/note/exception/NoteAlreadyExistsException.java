package com.dawn.backend.domain.note.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.NOTE_ALREADY_EXISTS)
public class NoteAlreadyExistsException extends BaseRuntimeException {
}
