package com.dawn.backend.domain.note.repository;

import org.springframework.data.repository.CrudRepository;

import com.dawn.backend.domain.note.entity.EditableNote;

public interface EditableRepository extends CrudRepository<EditableNote, Long> {
}
