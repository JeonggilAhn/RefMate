package com.dawn.backend.domain.user.entity;

import lombok.Getter;

@Getter
public class UnauthorizeUser extends User {
	Long permissionProjectId;

	public UnauthorizeUser(
		String userName,
		Long permissionProjectId
	) {
		super(userName);
		this.permissionProjectId = permissionProjectId;
	}
}
