package com.dawn.backend.global.interceptor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.domain.user.entity.UnauthorizeUser;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.exception.ExpiredAccessTokenException;
import com.dawn.backend.domain.user.exception.InvalidAccessTokenException;
import com.dawn.backend.domain.user.repository.TokenBlackListRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.email.entity.GrantToken;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Slf4j
public class StompSecurityInterceptor implements ChannelInterceptor {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final TokenBlackListRepository tokenBlackListRepository;
	private final GrantTokenRepository grantTokenRepository;

	public StompSecurityInterceptor(
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
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		// WebSocket/STOMP 헤더 정보 추출
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		// Connect 할 때만 토큰 검증 로직 수행
		if (StompCommand.CONNECT.equals(accessor.getCommand())) {
			String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
			if (authorizationHeader != null || !authorizationHeader.startsWith("Bearer ")) {
				log.error("[WebSocket] Authroization header is missing");
				throw new InvalidAccessTokenException();
			}

			// 토큰에서 Bearer 제거
			String token = authorizationHeader.substring(7);

			// 블랙리스트에 있는 토큰인지 검사
			if (tokenBlackListRepository.existsById(token)) {
				log.error("[WebSocket] Token is in blacklist");
				throw new InvalidAccessTokenException();
			}

			try {
				if (jwtUtil.isExpired(token)) {
					log.error("[WebSocket] Token is expired");
					throw new ExpiredAccessTokenException();
				}
			} catch (ExpiredAccessTokenException e) {
				log.error("[WebSocket] Token is expired");
			} catch (Exception e) {
				log.error("[WebSocket] Invalid token");
				throw new InvalidAccessTokenException();
			}

			String username;
			try {
				username = jwtUtil.getKey(token, "id");
			} catch (Exception e) {
				log.error("[WebSocket] Failed to get 'id' from token");
				throw new InvalidAccessTokenException();
			}

			User user;
			if (username.startsWith("Presigned")) {
				String uuid = username.split(" ")[1];
				GrantToken grantToken = grantTokenRepository
					.findById(uuid)
					.orElseThrow(InvalidAccessTokenException::new);
				user = new UnauthorizeUser(username, grantToken.getProjectId());
			} else {
				user = userRepository.getUserByUserName(username);
				if (user == null) {
					log.error("[WebSocket] User not found by username : {}", username);
					throw new InvalidAccessTokenException();
				}
			}

			// 인증 객체 생성 및 SecurityContextHolder 등록
			UsernamePasswordAuthenticationToken authenticationToken =
				new UsernamePasswordAuthenticationToken(user, null);
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);

			accessor.setUser(authenticationToken);
		}

		System.out.println();

		return message;
	}
}
