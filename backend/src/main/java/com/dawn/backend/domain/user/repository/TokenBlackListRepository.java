package com.dawn.backend.domain.user.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.user.entity.TokenBlackList;

@Repository
public interface TokenBlackListRepository extends CrudRepository<TokenBlackList, String> {
}
