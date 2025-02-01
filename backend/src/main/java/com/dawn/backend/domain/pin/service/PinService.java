package com.dawn.backend.domain.pin.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.note.entity.NoteImage;
import com.dawn.backend.domain.note.repository.ImageRepository;
import com.dawn.backend.domain.note.repository.NoteCheckRepository;
import com.dawn.backend.domain.pin.dto.ImageItem;
import com.dawn.backend.domain.pin.dto.PinGroupDto;
import com.dawn.backend.domain.pin.dto.PinItem;
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

	public PinService(
		PinRepository pinRepository,
		PinVersionRepository pinVersionRepository,
		PinGroupRepository pinGroupRepository,
		ImageRepository imageRepository,
		NoteCheckRepository noteCheckRepository
	) {
		this.pinRepository = pinRepository;
		this.pinVersionRepository = pinVersionRepository;
		this.pinGroupRepository = pinGroupRepository;
		this.imageRepository = imageRepository;
		this.noteCheckRepository = noteCheckRepository;
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
}
