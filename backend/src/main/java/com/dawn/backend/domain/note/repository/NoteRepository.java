package com.dawn.backend.domain.note.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.note.dto.NoteWithPinAndPinGroupDto;
import com.dawn.backend.domain.note.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

	@Query("""
		SELECT new com.dawn.backend.domain.note.dto.NoteWithPinAndPinGroupDto(
		u.userId, u.userEmail, u.profileImage,
		n.noteId, n.noteTitle, n.bookmark, n.createdAt,
		n.blueprintVersion.blueprint.blueprintId,
		n.blueprintVersion.blueprint.blueprintTitle,
		n.blueprintVersion.blueprintVersionId,
		n.blueprintVersion.previewImg,
		p.pinId, p.pinName, p.pinX, p.pinY,
		pg.pinGroupId, pg.pinGroupName, pg.pinGroupColor,
		(CASE WHEN COUNT(ni) > 0 THEN true ELSE false END)
		)
		FROM Note n
		JOIN n.user u
		JOIN n.blueprintVersion bv
		JOIN BlueprintVersion currentVersion
			ON currentVersion.blueprintVersionId = :blueprintVersionId
		JOIN n.pin p
		JOIN PinVersion pv ON pv.pin = p
			AND pv.blueprintVersion = n.blueprintVersion
			AND pv.isActive = true
		JOIN pv.pinGroup pg
		LEFT JOIN NoteImage ni ON ni.note = n
		WHERE bv.blueprint = currentVersion.blueprint
			AND bv.blueprintVersionSeq <= currentVersion.blueprintVersionSeq
			AND n.noteId < :lastId
			AND n.noteId >= :nextId
			AND n.isDeleted = false
		GROUP BY u.userId, u.userEmail, u.profileImage,
				n.noteId, u.userId, n.noteTitle, n.bookmark, n.createdAt,
				n.blueprintVersion.blueprint.blueprintId,
				n.blueprintVersion.blueprint.blueprintTitle,
				n.blueprintVersion.blueprintVersionId,
				n.blueprintVersion.previewImg,
				p.pinId, p.pinName, p.pinX, p.pinY,
				pg.pinGroupId, pg.pinGroupName, pg.pinGroupColor
		ORDER BY n.noteId ASC
		""")
	List<NoteWithPinAndPinGroupDto> findNotesWithPinAndPinGroupsByRange(
		@Param("blueprintVersionId") Long blueprintVersionId,
		@Param("nextId") Long nextId,
		@Param("lastId") Long lastId
		);

	@Query("""
		SELECT n.noteId FROM Note n
		WHERE n.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND n.isDeleted = false
			AND (
				LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))
				OR LOWER(n.noteContent) LIKE LOWER(CONCAT('%', :keyword, '%'))
			)
		""")
	List<Long> findNoteByKeyword(
		@Param("blueprintVersionId") Long blueprintVersionId,
		@Param("keyword") String keyword
	);

	@Query("""
		SELECT n.noteId FROM Note n
		WHERE n.pin.pinId = :pinId
			AND n.isDeleted = false
			AND (
				LOWER(n.noteTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))
				OR LOWER(n.noteContent) LIKE LOWER(CONCAT('%', :keyword, '%'))
			)
		""")
	List<Long> findNoteByKeywordByPin(
		@Param("pinId") Long pinId,
		@Param("keyword") String keyword
	);

	/**
	 * 커서 이후의 노트(최신 노트)
	 * @param blueprintVersionId
	 * @param cursorId
	 * @param pageable
	 * @return
	 */
	@Query("""
		SELECT n FROM Note n
		WHERE n.blueprintVersion.blueprintVersionId = :blueprintVersionId
			AND n.isDeleted = false
			AND n.noteId > :cursorId
		ORDER BY n.noteId DESC
		""")
	List<Note> findNotesByBlueprintVersionBeforeCursor(
		@Param("blueprintVersionId") Long blueprintVersionId,
		@Param("cursorId") Long cursorId,
		Pageable pageable
	);

	/**
	 * 커서 다음의 노트(오래된 노트)
	 * @param blueprintVersionId
	 * @param cursorId
	 * @param pageable
	 * @return
	 */
	@Query("""
		SELECT n FROM Note n
		JOIN n.blueprintVersion bv
		JOIN bv.blueprint b
		WHERE b.blueprintId = :blueprintId
			AND bv.blueprintVersionId <= :blueprintVersionId
			AND n.isDeleted = false
			AND n.noteId < :cursorId
		ORDER BY n.noteId DESC
		""")
	List<Note> findNotesByBlueprintVersionAfterCursor(
		@Param("blueprintId") Long blueprintId,
		@Param("blueprintVersionId") Long blueprintVersionId,
		@Param("cursorId") Long cursorId,
		Pageable pageable
	);

	@Query("""
		SELECT n FROM Note n
		WHERE n.pin.pinId = :pinId
			AND n.isDeleted = false
			AND n.noteId < :cursorId
		ORDER BY n.noteId ASC
		""")
	List<Note> findNotesByPinAfterCursor(
		@Param("pinId") Long pinId,
		@Param("cursorId") Long cursorId,
		Pageable pageable
	);

	List<Note> findAllByPinPinId(Long pinId);

	Note findFirstByPinPinIdAndIsDeletedFalseOrderByCreatedAtDesc(Long pinId);

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
