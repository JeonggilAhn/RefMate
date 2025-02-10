package com.dawn.backend.domain.note.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.note.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

	@Query("""
		SELECT n FROM Note n
		WHERE n.pin.pinId = :pinId
			AND n.isDeleted = false
			AND n.noteId < :cursorId
		ORDER BY n.createdAt DESC, n.noteId DESC
		""")
	List<Note> findNotesByPinAfterCursor(
		@Param("pinId") Long pinId,
		@Param("cursorId") Long cursorId,
		Pageable pageable
	);

	@Query("""
		SELECT n FROM Note n
		WHERE n.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND n.isDeleted = false
			AND n.noteId < :cursorId
		ORDER BY n.createdAt DESC, n.noteId DESC
		""")
	List<Note> findNotesByBlueprintVersionAfterCursor(
		@Param("blueprintVersionId") Long blueprintVersionId,
		@Param("cursorId") Long cursorId,
		Pageable pageable
	);

	List<Note> findAllByPinPinId(Long pinId);

	Optional<Note> findFirstByPinPinIdAndIsDeletedFalseOrderByCreatedAtDesc(Long pinId);

	@Query("""
		SELECT n FROM Note n
		WHERE n.pin.pinId = :pinId
				AND n.isDeleted = false
		""")
	List<Note> findAllByPinPinIdAndIsDeletedFalse(@Param("pinId") Long pinId);

	@Query("""
		SELECT n FROM Note n
		WHERE n.pin.pinId = :pinId
			AND n.bookmark = :bookmark
			AND n.isDeleted = false
		""")
	List<Note> findAllByPinPinIdAndBookmarkAndIsDeletedFalse(
		@Param("pinId") Long pinId,
		@Param("bookmark") boolean bookmark
	);
}
