package com.dawn.backend.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.entity.UserProject;

@Repository
public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
	@Query("""
			SELECT up
			FROM UserProject up
			JOIN up.user u
			WHERE up.project.projectId = :projectId
		""")
	List<UserProject> findProjectUsers(@Param("projectId") Long projectId);

	boolean existsByUserAndProject(User user, Project project);

	@Query("""
			SELECT up FROM UserProject up
			WHERE up.user.userId = :userId
		""")
	List<UserProject> findByUserId(@Param("userId") Long userId);

	@Query("SELECT up FROM UserProject up WHERE up.user.userId = :userId AND up.project.projectId = :projectId")
	Optional<UserProject> findByUserIdAndProjectId(@Param("userId") Long userId, @Param("projectId") Long projectId);

	List<UserProject> findUserByProjectProjectId(Long projectId);

	boolean existsByUserUserIdAndProjectProjectIdAndUserRole(Long userId, Long projectId, String userRole);
}

