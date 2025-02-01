package com.dawn.backend.domain.blueprint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.blueprint.entity.Blueprint;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {
	List<Blueprint> findAllByProjectProjectIdOrderByCreatedAtDesc(Long projectId);
}
