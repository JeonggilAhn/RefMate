package com.dawn.backend.domain.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dawn.backend.domain.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
	@Query("""
		SELECT p FROM Project p WHERE p.projectId IN :projectIds
		""")
	List<Project> findByIdIn(@Param("projectIds") List<Long> projectIds);
}
