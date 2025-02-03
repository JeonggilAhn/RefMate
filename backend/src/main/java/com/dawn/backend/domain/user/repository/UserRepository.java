package com.dawn.backend.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User getUserByUserName(String userName);

	Optional<User> findByUserEmail(String userEmail);
}
