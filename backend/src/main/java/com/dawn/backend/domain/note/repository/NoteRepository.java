package com.dawn.backend.domain.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dawn.backend.domain.note.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
	List<Note> findAllByPinPinId(Long pinId);

	List<Note> findAllByPinPinIdAndBookmark(Long pinId, boolean bookmark);

	List<Note> findAllByBlueprintVersion_BlueprintVersionId(Long blueprintVersionId);
}
