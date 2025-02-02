package com.dawn.backend.domain.note.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.dawn.backend.domain.note.dto.response.DeleteNoteResponseDto;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;
import com.dawn.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class NoteService {

	private final NoteRepository noteRepository;
	private final UserProjectRepository userProjectRepository;
	/**
	 * 일정 시간마다 note.isDeleted = true 인 노트 삭제 로직 필요
	 */
	@Transactional
	public DeleteNoteResponseDto deleteNote(Long noteId) {
//		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//		validatePermission(user.getUserId(), noteId);

		Note note = getNoteById(noteId);
		note.deleteNote();

		return new DeleteNoteResponseDto(noteId);
	}

	private void validatePermission(Long userId, Long noteId) {
		Note note = getNoteById(noteId);
		Long projectId = note.getBlueprintVersion().getBlueprint().getProject().getProjectId();

		userProjectRepository.findByUserIdAndProjectId(userId, projectId)
			.orElseThrow(() -> new RuntimeException("User does not have permission to delete this note."));
	}

	public Note getNoteById(Long noteId) {
		return noteRepository.findById(noteId)
			.orElseThrow(() -> new RuntimeException("Note not found with id " + noteId));
	}
}
