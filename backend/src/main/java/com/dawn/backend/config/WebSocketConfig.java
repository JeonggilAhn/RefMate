package com.dawn.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.dawn.backend.domain.user.repository.TokenBlackListRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.interceptor.StompSecurityInterceptor;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final TokenBlackListRepository tokenBlackListRepository;
	private final GrantTokenRepository grantTokenRepository;

	public WebSocketConfig(
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

	@Value("${front-url}")
	private String frontUrl;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		System.out.println("🔵 WebSocket 엔드포인트 등록됨: /api/websocket");
		registry
			.addEndpoint("/api/websocket")
			.setAllowedOrigins(frontUrl)
			.withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/api/topic");
		registry.setApplicationDestinationPrefixes("/api");
	}

//	@Override
//	public void configureClientInboundChannel(ChannelRegistration registration) {
//		registration.interceptors(new StompSecurityInterceptor(
//			jwtUtil,
//			userRepository,
//			tokenBlackListRepository,
//			grantTokenRepository
//		));
//	}
}
