package com.dawn.backend.global.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.dawn.backend.domain.user.entity.UnauthorizeUser;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.exception.ExpiredAccessTokenException;
import com.dawn.backend.domain.user.exception.InvalidAccessTokenException;
import com.dawn.backend.domain.user.repository.TokenBlackListRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.email.entity.GrantToken;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final TokenBlackListRepository tokenBlackListRepository;
	private final GrantTokenRepository grantTokenRepository;

	public JwtFilter(
		JwtUtil jwtUtil,
		UserRepository userRepository,
		TokenBlackListRepository tokenBlackListRepository,
		GrantTokenRepository grantTokenRepository
	) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.tokenBlackListRepository = tokenBlackListRepository;
		this.grantTokenRepository = grantTokenRepository;
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
			throw new InvalidAccessTokenException();
		}
		String token = authorizationHeader.substring(7);
		if (tokenBlackListRepository.existsById(token)) {
			throw new InvalidAccessTokenException();
		}
		String username;
		try {
			username = jwtUtil.getKey(token, "id");
		} catch (Exception e) {
			throw new InvalidAccessTokenException();
		}
		if (username == null) {
			throw new InvalidAccessTokenException();
		}
		try {
			jwtUtil.isExpired(token);
		} catch (Exception e) {
			throw new ExpiredAccessTokenException();
		}
		User user;
		if (username.startsWith("PreSigned")) {
			String uuid = username.split(" ")[1];
			GrantToken grantToken =
				grantTokenRepository.findById(uuid).orElseThrow(InvalidAccessTokenException::new);
			user = new UnauthorizeUser(username, grantToken.getProjectId());
		} else {
			user = userRepository.getUserByUserName(username);
			if (user == null) {
				throw new InvalidAccessTokenException();
			}
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
