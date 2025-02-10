package com.dawn.backend.domain.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dawn.backend.domain.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
	@Query("""
		SELECT p FROM Project p WHERE p.projectId IN :projectIds
		""")
	List<Project> findByIdIn(@Param("projectIds") List<Long> projectIds);


	@Query("""
		SELECT p FROM Project p WHERE p.projectId IN :projectIds AND p.isDeleted = false
		""")
	List<Project> findByIdInAndIsDeletedFalse(@Param("projectIds") List<Long> projectIds);

	@Query("""
		SELECT p FROM Note n
		JOIN n.blueprintVersion bv
		JOIN bv.blueprint b
		JOIN b.project p
		WHERE n.noteId = :noteId
		""")
	Optional<Project> findByNoteId(@Param("noteId") Long noteId);

	@Query("""
		SELECT p FROM NoteImage ni
		JOIN ni.note n
		JOIN n.blueprintVersion bv
		JOIN bv.blueprint b
		JOIN b.project p
		WHERE n.noteId = :noteId
		""")
	Optional<Project> findByImageId(@Param("noteId") Long noteId);

	@Query("""
		SELECT p FROM Pin pin
		JOIN PinVersion pv ON pin.pinId = pv.pin.pinId
		JOIN pv.blueprintVersion bv
		JOIN bv.blueprint b
		JOIN b.project p
		WHERE pin.pinId = :pinId
		""")
	Optional<Project> findByPinId(Long pinId);

	@Query("""
		SELECT b FROM Blueprint b
		WHERE b.blueprintId = :blueprintId
		""")
	Optional<Project> findByBlueprintId(Long blueprintId);
}
