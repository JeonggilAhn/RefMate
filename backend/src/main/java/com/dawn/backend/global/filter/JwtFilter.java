package com.dawn.backend.global.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.TokenBlackListRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final TokenBlackListRepository tokenBlackListRepository;

	public JwtFilter(
		JwtUtil jwtUtil,
		UserRepository userRepository,
		TokenBlackListRepository tokenBlackListRepository
	) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.tokenBlackListRepository = tokenBlackListRepository;
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		String authorizationHeader = request.getHeader("Authorization");
		if (authorizationHeader == null) {
			filterChain.doFilter(request, response);
			return;
		}
		if (!authorizationHeader.startsWith("Bearer ")) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		String token = authorizationHeader.substring(7);
		if (tokenBlackListRepository.existsById(token)) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		try {
			jwtUtil.isExpired(token);
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		String username = jwtUtil.getKey(token, "id");
		if (username == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		User user = userRepository.getUserByUserName(username);
		if (user == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		SecurityContextHolder
			.getContext()
			.setAuthentication(
				new UsernamePasswordAuthenticationToken(
					user, null
				)
			);
		filterChain.doFilter(request, response);
	}
}
