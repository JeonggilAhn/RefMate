package com.dawn.backend.domain.user.handler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.dawn.backend.global.exception.ExceptionCode;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@Configuration
public class PreAuthorizeExceptionHandler {

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> {
			ResponseWrapperFactory.setResponse(
				response,
				ExceptionCode.METHOD_UNAUTHORIZED,
				null
			);
		};
	}

	@Bean
	AccessDeniedHandler accessDeniedHandler() {
		return (request, response, authException) -> {
			ResponseWrapperFactory.setResponse(
				response,
				ExceptionCode.METHOD_FORBIDDEN,
				null
			);
		};
	}
}
