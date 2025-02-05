package com.dawn.backend.domain.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dawn.backend.domain.user.service.AuthService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
public class AuthController {
	private final AuthService authService;

	@Autowired
	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@GetMapping("/auth/issue")
	public ResponseEntity<ResponseWrapper<Void>> issue(@CookieValue("authentication_token") String token) {
		return ResponseWrapperFactory.setResponse(HttpStatus.OK, authService.setAccessToken(token));
	}
}
