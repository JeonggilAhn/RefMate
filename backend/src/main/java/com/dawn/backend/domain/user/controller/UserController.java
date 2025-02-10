package com.dawn.backend.domain.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dawn.backend.domain.user.dto.UserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.service.UserService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
public class UserController {
	private final UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/users/me")
	public ResponseEntity<ResponseWrapper<UserDto>> getSelf(
		@AuthenticationPrincipal User user
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			userService.user(user.getUserId())
		);
	}

	@GetMapping("/users/{userId}")
	public ResponseEntity<ResponseWrapper<UserDto>> getUser(
		@PathVariable("userId") Long userId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			userService.user(userId)
		);
	}

	@PreAuthorize("@authExpression.isSelf(#userId)")
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteUser(
		@PathVariable("userId") Long userId
	) {
		userService.userResign(userId);

		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null
		);
	}
}
