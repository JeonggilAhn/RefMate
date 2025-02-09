package com.dawn.backend.domain.user.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.dawn.backend.global.jpa.base.BaseTimeEntity;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String userName;

	@Column(unique = true)
	private String userEmail;

	private String profileImage;

	private String oauthProvider;

	//탈퇴 여부
	private Boolean resign = false;

	// 탈퇴일
	private LocalDateTime resignDate;

	@Builder
	public User(
		String userName,
		String userEmail,
		String profileImage,
		String oauthProvider
	) {
		this.userName = userName;
		this.userEmail = userEmail;
		this.profileImage = profileImage;
		this.oauthProvider = oauthProvider;
	}

	public User(
		String userName
	) {
		this.userName = String.format("PreSigned %s", userName);
		this.userEmail = "PreSigned User";
	}
}
