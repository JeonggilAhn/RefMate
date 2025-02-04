package com.dawn.backend.domain.user.dto.oauthresponse;

public interface OAuth2Response {
	String getProvider();

	String getProviderId();

	String getEmail();

	String getName();

	String getProfileImg();
}
