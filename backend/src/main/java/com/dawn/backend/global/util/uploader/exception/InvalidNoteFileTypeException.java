package com.dawn.backend.global.util.uploader.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.INVALID_NOTE_FILE_TYPE)
public class InvalidNoteFileTypeException extends BaseRuntimeException {
}
