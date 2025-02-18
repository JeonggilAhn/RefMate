package com.dawn.backend.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.user.dto.ProjectUserDto;
import com.dawn.backend.domain.user.dto.ProjectUserWithReadNoteDto;
import com.dawn.backend.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User getUserByUserName(String userName);

	Optional<User> findByUserEmail(String userEmail);

	@Query("""
		SELECT new com.dawn.backend.domain.user.dto.ProjectUserDto(
			u.userId, u.userEmail, u.profileImage, u.createdAt, up.userRole
		)
		FROM User u
		LEFT JOIN UserProject up ON u.userId = up.user.userId AND up.project.projectId = :projectId
		WHERE u.userId = :userId
		""")
	ProjectUserDto findUserWithRoleByUserIdAndProjectId(
		@Param("userId") Long userId,
		@Param("projectId") Long projectId
	);

	@Query("""
		SELECT new com.dawn.backend.domain.user.dto.ProjectUserDto(
			u.userId, u.userEmail, u.profileImage, u.createdAt, up.userRole
		)
		FROM User u
		JOIN UserNoteCheck unc ON u.userId = unc.user.userId
		JOIN UserProject up ON u.userId = up.user.userId
		WHERE up.project.projectId = :projectId AND unc.note.noteId = :noteId AND unc.isChecked = true
		""")
	List<ProjectUserDto> findCheckedUsersWithRolesByNoteId(
		@Param("noteId") Long noteId, @Param("projectId") Long projectId);

	@Query("""
		SELECT new com.dawn.backend.domain.user.dto.ProjectUserWithReadNoteDto(
			u.userId, u.userEmail, u.profileImage, u.createdAt, up.userRole, unc.note.noteId
		)
		FROM User u
		JOIN UserNoteCheck unc ON u.userId = unc.user.userId
		JOIN UserProject up ON u.userId = up.user.userId
		WHERE up.project.projectId = :projectId AND unc.note.noteId IN :noteIds AND unc.isChecked = true
		""")
	List<ProjectUserWithReadNoteDto> findCheckedUsersWithRolesByNoteIds(
		@Param("noteIds") List<Long> noteIds, @Param("projectId") Long projectId);


	@Query("""
			SELECT new com.dawn.backend.domain.user.dto.ProjectUserDto(
				u.userId, u.userEmail, u.profileImage, u.createdAt, up.userRole
			)
			FROM User u
			LEFT JOIN UserProject up ON u.userId = up.user.userId AND up.project.projectId = :projectId
			WHERE u.userId IN :userIds
		""")
	List<ProjectUserDto> findUsersWithRolesByUserIds(
		@Param("userIds") List<Long> userIds,
		@Param("projectId") Long projectId
	);


}
