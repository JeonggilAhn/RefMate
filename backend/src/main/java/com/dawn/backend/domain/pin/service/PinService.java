package com.dawn.backend.domain.pin.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.note.entity.Note;
import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.note.repository.ImageRepository;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.note.repository.NoteRepository;
import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.pin.dto.PinGroupDto;
import com.dawn.backend.domain.pin.dto.PinImageItem;
import com.dawn.backend.domain.pin.dto.PinItem;
import com.dawn.backend.domain.pin.dto.request.CreatePinRequestDto;
import com.dawn.backend.domain.pin.dto.response.CreatePinResponseDto;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinGroup;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.repository.PinGroupRepository;
import com.dawn.backend.domain.pin.repository.PinRepository;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.user.entity.User;

@Service
public class PinService {
	private final PinRepository pinRepository;
	private final PinVersionRepository pinVersionRepository;
	private final PinGroupRepository pinGroupRepository;
	private final ImageRepository imageRepository;
	private final NoteCheckRepository noteCheckRepository;
	private final NoteRepository noteRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;

	public PinService(
		PinRepository pinRepository,
		PinVersionRepository pinVersionRepository,
		PinGroupRepository pinGroupRepository,
		ImageRepository imageRepository,
		NoteCheckRepository noteCheckRepository,
		NoteRepository noteRepository, BlueprintVersionRepository blueprintVersionRepository) {
		this.pinRepository = pinRepository;
		this.pinVersionRepository = pinVersionRepository;
		this.pinGroupRepository = pinGroupRepository;
		this.imageRepository = imageRepository;
		this.noteCheckRepository = noteCheckRepository;
		this.noteRepository = noteRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
	}

	public List<PinItem> pins(Long blueprintId, Long blueprintVersionId) {

		List<PinVersion> pinlist =
			pinVersionRepository.findAllByBlueprintVersionBlueprintVersionId(blueprintVersionId);

		return pinlist.stream()
			.map(pinVersion -> {

				List<NoteImage> noteImages =
					imageRepository.findAllByPinOrderByBookmark(pinVersion.getPin());

				List<ImageItem> previewImages = noteImages.stream()
					.map(noteImage -> new ImageItem(
						noteImage.getImageId(),
						noteImage.getImageOrigin(),
						noteImage.getImagePreview(),
						noteImage.getBookmark()
					))
					.toList();

				PinGroupDto pinGroupDto = new PinGroupDto(
					pinVersion.getPinGroup().getPinGroupId(),
					pinVersion.getPinGroupName() != null
						? pinVersion.getPinGroupName()
						: pinVersion.getPinGroup().getPinGroupName(),
					pinVersion.getPinGroup().getPinGroupColor()
				);

				User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

				boolean hasUnreadNote =
					noteCheckRepository.hasUnreadNoteByPin(user, pinVersion.getPin());

				return new PinItem(
					pinVersion.getPin().getPinId(),
					pinVersion.getPin().getPinName(),
					pinVersion.getPin().getPinX(),
					pinVersion.getPin().getPinY(),
					previewImages,
					previewImages.size(),
					pinGroupDto,
					hasUnreadNote,
					pinVersion.getIsActive()
				);
			})
			.toList();
	}

	public List<PinImageItem> pinImages(Long pinId) {

		List<Note> noteList =
			noteRepository.findAllByPinPinId(pinId);

		return noteList.stream()
			.map(note -> {

				List<NoteImage> noteImages =
					imageRepository.findAllByNoteNoteIdOrderByBookmark(note.getNoteId());

				List<ImageItem> imageItems = noteImages.stream()
					.map(noteImage -> new ImageItem(
						noteImage.getImageId(),
						noteImage.getImageOrigin(),
						noteImage.getImagePreview(),
						noteImage.getBookmark()
					))
					.toList();

				return new PinImageItem(
					note.getNoteId(),
					note.getNoteTitle(),
					imageItems
				);
			})
			.toList();
	}

	public List<PinGroupDto> pinGroups(Long blueprintId) {

		List<PinGroup> pinGroups =
			pinGroupRepository.findAllByBlueprintBlueprintId(blueprintId);

		return pinGroups.stream()
			.map(pinGroup -> new PinGroupDto(
				pinGroup.getPinGroupId(),
				pinGroup.getPinGroupName(),
				pinGroup.getPinGroupColor()
			))
			.toList();
	}

	@Transactional
	public CreatePinResponseDto createPin(
		Long blueprintId,
		Long versionId,
		CreatePinRequestDto pinInfo
	) {
		Pin pin = Pin.builder()
			.pinX(pinInfo.pinX())
			.pinY(pinInfo.pinY())
			.pinName(pinInfo.pinName())
			.build();

		Pin savedPin = pinRepository.save(pin);

		BlueprintVersion blueprintVersion =
			blueprintVersionRepository.findById(versionId).get();

		PinGroup pinGroup =
			pinGroupRepository.findById(pinInfo.pinGroupId()).get();

		PinVersion pinVersion = PinVersion.builder()
			.pin(savedPin)
			.blueprintVersion(blueprintVersion)
			.pinGroup(pinGroup)
			.build();

		pinVersionRepository.save(pinVersion);

		return new CreatePinResponseDto(
			savedPin.getPinId()
		);
	}
}
