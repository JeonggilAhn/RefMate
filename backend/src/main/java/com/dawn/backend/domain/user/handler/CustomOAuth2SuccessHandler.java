package com.dawn.backend.domain.user.handler;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.dawn.backend.domain.user.dto.CustomOAuth2User;
import com.dawn.backend.global.response.ResponseWrapperFactory;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
	private final JwtUtil jwtUtil;

	@Value("${login-endpoint}")
	private String loginSuccessEndpoint;

	@Autowired
	public CustomOAuth2SuccessHandler(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	public void onAuthenticationSuccess(
		HttpServletRequest request,
		HttpServletResponse response,
		Authentication authentication
	) throws IOException, ServletException {
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
		String authenticationToken = jwtUtil.generateToken(
			((CustomOAuth2User)oAuth2User).getUser(),
			10 * 60 * 60 * 1000L
		);
		System.out.println(authenticationToken);
		ResponseWrapperFactory.setResponse(HttpStatus.OK, null, authenticationToken);
		Cookie cookie = new Cookie("authentication_token", authenticationToken);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		response.addCookie(cookie);
		response.sendRedirect(loginSuccessEndpoint);
	}
}
