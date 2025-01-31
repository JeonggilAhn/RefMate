package com.dawn.backend.domain.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Service
public class AuthService {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;

	@Autowired
	public AuthService(JwtUtil jwtUtil, UserRepository userRepository) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
	}

	public HttpHeaders setAccessToken(String token) {
		HttpHeaders headers = new HttpHeaders();
		String userName = jwtUtil.getKey(token, "id");
		User user = userRepository.getUserByUserName(userName);
		if (user == null) {
			return null;
		}
		String accessToken = jwtUtil.generateToken(user);
		headers.set("Authorization", "Bearer " + accessToken);
		return headers;
	}
}
