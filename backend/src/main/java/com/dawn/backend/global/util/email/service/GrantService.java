package com.dawn.backend.global.util.email.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.global.util.email.entity.GrantToken;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrantService {
	private final GrantTokenRepository grantTokenRepository;

	public String createGrantToken(Long projectId, String role) {
		String uuid = UUID.randomUUID().toString();
		GrantToken grantToken = new GrantToken(uuid, projectId, role);
		grantTokenRepository.save(grantToken);
		return uuid;
	}
}
