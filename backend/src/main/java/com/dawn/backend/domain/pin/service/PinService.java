package com.dawn.backend.domain.pin.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintVersionNotFound;
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
import com.dawn.backend.domain.pin.dto.request.UpdatePinGroupRequestDto;
import com.dawn.backend.domain.pin.dto.request.UpdatePinNameRequestDto;
import com.dawn.backend.domain.pin.dto.response.CreatePinResponseDto;
import com.dawn.backend.domain.pin.dto.response.UpdatePinGroupResponseDto;
import com.dawn.backend.domain.pin.dto.response.UpdatePinNameResponseDto;
import com.dawn.backend.domain.pin.dto.response.UpdatePinStatusResponseDto;
import com.dawn.backend.domain.pin.entity.DefaultPinGroup;
import com.dawn.backend.domain.pin.entity.Pin;
import com.dawn.backend.domain.pin.entity.PinGroup;
import com.dawn.backend.domain.pin.entity.PinVersion;
import com.dawn.backend.domain.pin.exception.PinGroupNotFound;
import com.dawn.backend.domain.pin.exception.PinNotFoundException;
import com.dawn.backend.domain.pin.repository.PinGroupRepository;
import com.dawn.backend.domain.pin.repository.PinRepository;
import com.dawn.backend.domain.pin.repository.PinVersionRepository;
import com.dawn.backend.domain.user.entity.UnauthorizeUser;
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

	@Autowired
	public PinService(
		PinRepository pinRepository,
		PinVersionRepository pinVersionRepository,
		PinGroupRepository pinGroupRepository,
		ImageRepository imageRepository,
		NoteCheckRepository noteCheckRepository,
		NoteRepository noteRepository,
		BlueprintVersionRepository blueprintVersionRepository
	) {
		this.pinRepository = pinRepository;
		this.pinVersionRepository = pinVersionRepository;
		this.pinGroupRepository = pinGroupRepository;
		this.imageRepository = imageRepository;
		this.noteCheckRepository = noteCheckRepository;
		this.noteRepository = noteRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
	}

	public List<PinItem> pins(Long blueprintVersionId, Boolean isActive, Long pinGroupId, User user) {

		List<PinVersion> pinlist;
		if (isActive == null && pinGroupId == null) {
			pinlist = pinVersionRepository.findAllByBlueprintVersionId(blueprintVersionId);
		} else if (isActive == null) {
			pinlist = pinVersionRepository.findAllByBlueprintVersionIdAndPinGroupId(blueprintVersionId, pinGroupId);
		} else if (pinGroupId == null) {
			pinlist = pinVersionRepository.findAllByBlueprintVersionIdAndIsActive(blueprintVersionId, isActive);
		} else {
			pinlist = pinVersionRepository.findAllByBlueprintVersionIdAndPinGroupIdAndIsActive(
				blueprintVersionId, pinGroupId, isActive
			);
		}

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

				boolean hasUnreadNote = false;
//				if (!(user instanceof UnauthorizeUser)) {
//					hasUnreadNote =
//						noteCheckRepository.hasUnreadNoteByPin(user, pinVersion.getPin());
//				}

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
			.filter(item -> !item.imageList().isEmpty())
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
			blueprintVersionRepository.findById(versionId)
				.orElseThrow(BlueprintVersionNotFound::new);

		PinGroup pinGroup =
			pinGroupRepository.findById(pinInfo.pinGroupId())
				.orElseThrow(PinGroupNotFound::new);

		PinVersion pinVersion = PinVersion.builder()
			.pin(savedPin)
			.blueprintVersion(blueprintVersion)
			.pinGroup(pinGroup)
			.build();

		pinVersionRepository.save(pinVersion);

		return new CreatePinResponseDto(
			PinItem.from(savedPin, PinGroupDto.from(pinGroup), pinVersion)
		);
	}

	public UpdatePinStatusResponseDto updatePinStatus(Long pinId, Long versionId) {

		PinVersion pinVersion =
			pinVersionRepository.findFirstByBlueprintVersionBlueprintVersionIdAndPinPinId(versionId, pinId);

		pinVersion.setIsActive(!pinVersion.getIsActive());
		PinVersion savedPinVersion = pinVersionRepository.save(pinVersion);

		return new UpdatePinStatusResponseDto(
			savedPinVersion.getPin().getPinId(),
			savedPinVersion.getIsActive()
		);
	}

	public UpdatePinNameResponseDto updatePinName(
		Long pinId,
		UpdatePinNameRequestDto pinInfo
	) {
		Pin pin = pinRepository.findById(pinId)
			.orElseThrow(PinNotFoundException::new);

		pin.setPinName(pinInfo.pinName());
		Pin savedPin = pinRepository.save(pin);

		return new UpdatePinNameResponseDto(
			savedPin.getPinId(),
			savedPin.getPinName()
		);
	}

	public UpdatePinGroupResponseDto updatePinGroup(
		Long pinId,
		Long versionId,
		UpdatePinGroupRequestDto pinInfo
	) {
		PinVersion pinVersion =
			pinVersionRepository.findFirstByBlueprintVersionBlueprintVersionIdAndPinPinId(versionId, pinId);

		PinGroup pinGroup =
			pinGroupRepository.findById(pinInfo.pinGroupId())
				.orElseThrow(PinGroupNotFound::new);

		pinVersion.setPinGroup(pinGroup);
		PinVersion savedPinVersion = pinVersionRepository.save(pinVersion);

		return new UpdatePinGroupResponseDto(
			savedPinVersion.getPinVersionId(),
			savedPinVersion.getPinGroup().getPinGroupId(),
			savedPinVersion.getPinGroup().getPinGroupName(),
			savedPinVersion.getPinGroup().getPinGroupColor()
		);
	}

	public void createDefaultPinGroup(Blueprint targetBlueprint) {
		List<PinGroup> pinGroupList = Arrays.stream(DefaultPinGroup.values())
			.map(defaultPinGroup -> PinGroup.builder()
				.pinGroupName(defaultPinGroup.getName())
				.pinGroupColor(defaultPinGroup.getColor())
				.blueprint(targetBlueprint)
				.build()
			)
			.toList();

		pinGroupRepository.saveAll(pinGroupList);
	}

	@Transactional
	public void copyPreVersionPins(BlueprintVersion preVersion, BlueprintVersion postVersion) {
		List<PinVersion> pinVersionList =
			pinVersionRepository.findAllByBlueprintVersionBlueprintVersionId(preVersion.getBlueprintVersionId());

		List<PinVersion> newPinVersions = pinVersionList.stream()
			.map(oldVersion -> PinVersion.builder()
				.pin(oldVersion.getPin())
				.blueprintVersion(postVersion)
				.pinGroup(oldVersion.getPinGroup())
				.pinGroupName(oldVersion.getPinGroupName())
				.isActive(oldVersion.getIsActive())
				.build())
			.toList();

		pinVersionRepository.saveAll(newPinVersions);
	}
}
