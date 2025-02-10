package com.dawn.backend.domain.note.service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.transaction.Transactional;

import com.dawn.backend.domain.blueprint.dto.ReadUserDto;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.note.entity.UserNoteCheck;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.user.dto.UserDto;
import com.dawn.backend.domain.user.entity.User;

@Service
public class ReadCheckService {
	private final ConcurrentMap<Long, SseEmitter> emitters;
	private final BlueprintRepository blueprintRepository;
	private final NoteCheckRepository noteCheckRepository;

	public ReadCheckService(
		BlueprintRepository blueprintRepository,
		NoteCheckRepository noteCheckRepository
	) {
		emitters = new ConcurrentHashMap<>();
		this.blueprintRepository = blueprintRepository;
		this.noteCheckRepository = noteCheckRepository;
	}

	public void startSseEmitter(Long blueprintId) {
		emitters.putIfAbsent(blueprintId, new SseEmitter());
	}

	public SseEmitter getSseEmitter(Long blueprintId) {
		return emitters.get(blueprintId);
	}

	@Transactional
	public void sendEvent(Long noteId, User user) {
		Long blueprintId =
			blueprintRepository.findBlueprintIdByNoteId(noteId);

		UserNoteCheck userNoteCheck = noteCheckRepository.findByNoteNoteIdAndUser(noteId, user);
		if (userNoteCheck.getIsChecked()) {
			return;
		} else {
			userNoteCheck.setIsChecked(true);
		}

		SseEmitter sseEmitter = getSseEmitter(blueprintId);
		try {
			sseEmitter.send(
				new ReadUserDto(
					noteId,
					new UserDto(
						user.getUserId(),
						user.getUserEmail(),
						user.getProfileImage(),
						user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
					)
				),
				MediaType.APPLICATION_JSON
			);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
