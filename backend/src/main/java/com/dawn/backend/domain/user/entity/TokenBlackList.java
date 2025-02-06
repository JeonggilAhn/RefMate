package com.dawn.backend.domain.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;

@RedisHash(
	value = "token-blacklist",
	timeToLive = 60 * 60 * 24 * 7
)
@Getter
@AllArgsConstructor
public class TokenBlackList {
	@Id
	private String accessToken;
}
