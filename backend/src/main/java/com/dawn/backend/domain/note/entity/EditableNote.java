package com.dawn.backend.domain.note.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;

@RedisHash(
	value = "editable-note",
	timeToLive = 60 * 5
)
@Getter
@AllArgsConstructor
public class EditableNote {
	@Id
	private Long noteId;
	private LocalDateTime createdAt;
}
