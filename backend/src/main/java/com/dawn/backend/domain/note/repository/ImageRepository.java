package com.dawn.backend.domain.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.pin.entity.Pin;

@Repository
public interface ImageRepository extends JpaRepository<NoteImage, Long> {
	@Query(
		"SELECT im "
		+ "FROM NoteImage im "
		+ "WHERE im.note.noteId IN (SELECT nt.noteId FROM Note nt WHERE nt.pin = :pin) "
		+ "ORDER BY im.bookmark"
	)
	List<NoteImage> findAllByPinOrderByBookmark(Pin pin);

	List<NoteImage> findAllByNoteNoteIdOrderByBookmark(Long noteId);
}
