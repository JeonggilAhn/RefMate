package com.dawn.backend.global.util.email.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;

@RedisHash(
	value = "grant-token"
)
@Getter
@AllArgsConstructor
public class GrantToken {
	@Id
	private String uuid;
	private Long projectId;
	private String role;
}
