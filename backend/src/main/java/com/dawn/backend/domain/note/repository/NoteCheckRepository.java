package com.dawn.backend.domain.note.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.UserNoteCheck;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.user.entity.User;

@Repository
public interface NoteCheckRepository extends JpaRepository<UserNoteCheck, Long> {
	@Query(
		"SELECT COUNT (check) > 0 "
			+ "FROM UserNoteCheck check "
			+ "WHERE check.user = :user "
			+ "AND check.note IN (SELECT nt FROM Note nt WHERE nt.pin = :pin)"
	)
	boolean hasUnreadNoteByPin(User user, Pin pin);


	boolean existsByUserAndNote(User user, Note note);

	UserNoteCheck findByNoteNoteIdAndUser(Long noteId, User user);
}
