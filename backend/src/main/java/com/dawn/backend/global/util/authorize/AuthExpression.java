package com.dawn.backend.global.util.authorize;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.exception.NoteNotFoundException;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.user.entity.User;
import com.dawn.backend.domain.user.repository.UserProjectRepository;

@Component
public class AuthExpression {
	private final UserProjectRepository userProjectRepository;
	private final NoteRepository noteRepository;

	@Autowired
	public AuthExpression(
		UserProjectRepository userProjectRepository,
		NoteRepository noteRepository
	) {
		this.userProjectRepository = userProjectRepository;
		this.noteRepository = noteRepository;
	}

	public boolean isSelf(Long userId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return user.getUserId().equals(userId);
	}

	public boolean hasProjectPermission(Long projectId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userProjectRepository.findByUserIdAndProjectId(user.getUserId(), projectId).isPresent();
	}

	public boolean isNoteWriter(Long noteId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Note note = noteRepository.findById(noteId).orElseThrow(NoteNotFoundException::new);
		return note.getUser().equals(user);
	}
}
