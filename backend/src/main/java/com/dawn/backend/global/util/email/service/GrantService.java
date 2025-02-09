package com.dawn.backend.global.util.email.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.domain.user.entity.UnauthorizeUser;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.global.util.email.entity.GrantToken;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrantService {
	private final GrantTokenRepository grantTokenRepository;
	private final JwtUtil jwtUtil;

	public String createGrantToken(Long projectId, String role) {
		String uuid = UUID.randomUUID().toString();
		GrantToken grantToken = new GrantToken(uuid, projectId, role);
		grantTokenRepository.save(grantToken);
		return uuid;
	}

	public String createUnauthorizedGrantToken(Long projectId) {
		String uuid = createGrantToken(projectId, "Role_PreSigned");

		return jwtUtil.generateToken(
			new UnauthorizeUser(uuid, projectId),
			7 * 24 * 60 * 60 * 1000L
		);
	}
}
