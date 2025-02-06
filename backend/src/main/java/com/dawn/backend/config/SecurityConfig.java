package com.dawn.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;

import jakarta.servlet.http.HttpServletRequest;

import com.dawn.backend.domain.user.handler.CustomOAuth2SuccessHandler;
import com.dawn.backend.domain.user.repository.TokenBlackListRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.domain.user.service.CustomOAuth2UserService;
import com.dawn.backend.global.filter.CustomLogoutFilter;
import com.dawn.backend.global.filter.JwtFilter;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Configuration
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final TokenBlackListRepository tokenBlackListRepository;

	@Autowired
	SecurityConfig(
		CustomOAuth2UserService customOAuth2UserService,
		CustomOAuth2SuccessHandler customOAuth2SuccessHandler,
		JwtUtil jwtUtil,
		UserRepository userRepository,
		TokenBlackListRepository tokenBlackListRepository
	) {
		this.customOAuth2UserService = customOAuth2UserService;
		this.customOAuth2SuccessHandler = customOAuth2SuccessHandler;
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.tokenBlackListRepository = tokenBlackListRepository;
	}

	// secret encoder
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// user role
	@Bean
	public RoleHierarchy roleHierarchy() {
		String hierarchy = "ROLE_ADMIN > ROLE_USER";
		return RoleHierarchyImpl.fromHierarchy(hierarchy);
	}

	// cors config
	private CorsConfiguration corsConfiguration(HttpServletRequest request) {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.addAllowedHeader("*");
		corsConfiguration.addAllowedMethod("*");
		corsConfiguration.addAllowedOrigin("*");

		return corsConfiguration;
	}

	// secret-filter-chain
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		// default disable
		http.csrf(AbstractHttpConfigurer::disable);
		http.httpBasic(AbstractHttpConfigurer::disable);
		http.formLogin(AbstractHttpConfigurer::disable);

		// allow cors
		http.cors(cors -> cors.configurationSource(this::corsConfiguration));

		// stateless session
		http.sessionManagement((session) -> session
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		);

		// oauth2 config
		http.oauth2Login(oauth2 -> oauth2
			.userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
				.userService(customOAuth2UserService)
			)
			.successHandler(customOAuth2SuccessHandler)
		);

		// jwt filter
		JwtFilter jwtFilter = new JwtFilter(jwtUtil, userRepository, tokenBlackListRepository);
		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		// logout
		CustomLogoutFilter customLogoutFilter = new CustomLogoutFilter(tokenBlackListRepository);
		http.addFilterBefore(customLogoutFilter, LogoutFilter.class);

		return http.build();
	}
}
