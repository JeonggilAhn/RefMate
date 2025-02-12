package com.dawn.backend.domain.user.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.user.dto.UserDto;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.exception.UserNotFoundException;
import com.dawn.backend.domain.user.repository.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserDto user(Long id) {
		User user =
			userRepository.findById(id).orElseThrow(UserNotFoundException::new);

		return new UserDto(
			user.getUserId(),
			user.getUserEmail(),
			user.getProfileImage(),
			user.getCreatedAt()
		);
	}

	public void userResign(Long id) {
		User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);

		user.setResign(true);
		user.setResignDate(LocalDateTime.now());
		userRepository.save(user);
	}
}
