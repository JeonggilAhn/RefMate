package com.dawn.backend.domain.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;
import com.dawn.backend.domain.user.exception.UserNotFoundException;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;
import com.dawn.backend.global.util.email.entity.GrantToken;
import com.dawn.backend.global.util.email.exception.InvalidGrantTokenException;
import com.dawn.backend.global.util.email.repository.GrantTokenRepository;
import com.dawn.backend.global.util.jwt.JwtUtil;

@Slf4j
@Service
public class AuthService {
	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final GrantTokenRepository grantTokenRepository;
	private final ProjectRepository projectRepository;
	private final UserProjectRepository userProjectRepository;

	@Autowired
	public AuthService(JwtUtil jwtUtil, UserRepository userRepository, GrantTokenRepository grantTokenRepository,
						ProjectRepository projectRepository, UserProjectRepository userProjectRepository) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.grantTokenRepository = grantTokenRepository;
		this.projectRepository = projectRepository;
		this.userProjectRepository = userProjectRepository;
	}

	public HttpHeaders setAccessToken(String token, String grantToken) {
		HttpHeaders headers = new HttpHeaders();
		String userName = jwtUtil.getKey(token, "id");
		User user = userRepository.getUserByUserName(userName);
		if (user == null) {
			throw new UserNotFoundException();
		}

		if (grantToken != null) {
			GrantToken grantTokenEntry = grantTokenRepository.findById(grantToken)
				.orElseThrow(InvalidGrantTokenException::new);
			Project project = projectRepository.findById(grantTokenEntry.getProjectId())
				.orElseThrow(ProjectNotFoundException::new);

			if (!userProjectRepository.existsByUserAndProject(user, project)) {
				UserProject userProject = new UserProject(grantTokenEntry.getRole(), user, project);
				userProjectRepository.save(userProject);
				grantTokenRepository.deleteById(grantToken);
				headers.add("Location", "/api/projects/" + project.getProjectId() + "/blueprints");
			}
			log.info("User {} is already invited to the project {}", user.getUserName(), project.getProjectId());
		}

		String accessToken = jwtUtil.generateToken(user, 24 * 60 * 60 * 1000L);
		headers.set("Authorization", "Bearer " + accessToken);
		return headers;
	}
}
