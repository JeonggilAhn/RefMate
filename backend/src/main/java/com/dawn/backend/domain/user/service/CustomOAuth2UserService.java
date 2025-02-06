package com.dawn.backend.domain.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.user.dto.CustomOAuth2User;
import com.dawn.backend.domain.user.dto.oauthresponse.GoogleResponse;
import com.dawn.backend.domain.user.dto.oauthresponse.KakaoResponse;
import com.dawn.backend.domain.user.dto.oauthresponse.NaverResponse;
import com.dawn.backend.domain.user.dto.oauthresponse.OAuth2Response;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	private final UserRepository userRepository;

	@Autowired
	public CustomOAuth2UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);

		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		OAuth2Response oAuth2Response = switch (registrationId) {
			case "google" -> new GoogleResponse(oAuth2User.getAttributes());
			case "naver" -> new NaverResponse(oAuth2User.getAttributes());
			case "kakao" -> new KakaoResponse(oAuth2User.getAttributes());
			default -> null;
		};

		if (oAuth2Response == null) {
			return null;
		}

		String userName = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
		User existUser = userRepository.getUserByUserName(userName);

		if (existUser == null) {
			User user = User.builder()
				.userName(userName)
				.userEmail(oAuth2Response.getEmail())
				.oauthProvider(oAuth2Response.getProvider())
				.profileImage(oAuth2Response.getProfileImg())
				.build();

			existUser = user;
		} else {
			existUser.setUserEmail(oAuth2Response.getEmail());
			existUser.setProfileImage(oAuth2Response.getProfileImg());
		}

		userRepository.save(existUser);

		return new CustomOAuth2User(existUser);
	}
}
