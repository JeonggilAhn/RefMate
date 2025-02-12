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

	@Query("SELECT n.blueprintVersion.blueprint FROM Note n WHERE n.noteId = :noteId")
	Optional<Project> findByNoteId(@Param("noteId") Long noteId);

	@Query("SELECT n.blueprintVersion.blueprint FROM NoteImage ni JOIN ni.note n WHERE ni.imageId = :imageId")
	Optional<Project> findByImageId(@Param("imageId") Long imageId);

	@Query("SELECT pv.blueprintVersion.blueprint FROM PinVersion pv WHERE pv.pin.pinId = :pinId")
	Optional<Project> findByPinId(Long pinId);

	@Query("SELECT b.project FROM Blueprint b WHERE b.blueprintId = :blueprintId")
	Optional<Project> findByBlueprintId(Long blueprintId);
}
