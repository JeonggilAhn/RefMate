package com.dawn.backend.global.util.email.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.global.util.email.entity.GrantToken;

@Repository
public interface GrantTokenRepository extends CrudRepository<GrantToken, String> {
}
