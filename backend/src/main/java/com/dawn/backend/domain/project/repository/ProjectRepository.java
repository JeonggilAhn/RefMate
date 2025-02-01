package com.dawn.backend.domain.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawn.backend.domain.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
