package com.dawn.backend.domain.note.exception;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;

@CustomException(ExceptionCode.RECENT_NOTE_NOT_FOUND)
public class RecentNoteNotFound extends BaseRuntimeException {
}
