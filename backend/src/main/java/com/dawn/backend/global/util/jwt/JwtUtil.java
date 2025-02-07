package com.dawn.backend.global.util.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;

import com.dawn.backend.domain.user.entity.User;

@Component
public class JwtUtil {
	private final SecretKey secretKey;

	public JwtUtil(@Value("${jwt-secret}") String secret) {
		this.secretKey = new SecretKeySpec(
			secret.getBytes(StandardCharsets.UTF_8),
			Jwts.SIG.HS256.key().build().getAlgorithm()
		);
	}

	public Claims parse(String token) throws SignatureException {
		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	public String getKey(String token, String key) {
		return parse(token).get(key, String.class);
	}

	public Boolean isExpired(String token) {
		Date expiration = parse(token).getExpiration();
		return expiration.before(new Date());
	}

	public String generateToken(User user, Long expireTime) {
		return Jwts.builder()
			.claim("id", user.getUserName())
			.issuedAt(new Date(System.currentTimeMillis()))
			.expiration(new Date(System.currentTimeMillis() + expireTime))
			.signWith(secretKey)
			.compact();
	}
}
