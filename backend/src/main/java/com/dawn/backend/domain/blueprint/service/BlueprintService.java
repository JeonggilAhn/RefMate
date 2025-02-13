package com.dawn.backend.domain.blueprint.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;
import com.dawn.backend.domain.blueprint.dto.request.CreateBlueprintRequestDto;
import com.dawn.backend.domain.blueprint.dto.request.CreateBlueprintVersionRequestDto;
import com.dawn.backend.domain.blueprint.dto.request.UpdateBlueprintRequestDto;
import com.dawn.backend.domain.blueprint.dto.response.CreateBlueprintResponseDto;
import com.dawn.backend.domain.blueprint.dto.response.CreateBlueprintVersionResponseDto;
import com.dawn.backend.domain.blueprint.dto.response.UpdateBlueprintResponseDto;
import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.exception.BlueprintNotFoundException;
import com.dawn.backend.domain.blueprint.exception.BlueprintVersionNotFoundException;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.pin.service.PinService;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.exception.ProjectNotFoundException;
import com.dawn.backend.domain.project.repository.ProjectRepository;
import com.dawn.backend.global.util.uploader.dto.ImagePathDto;
import com.dawn.backend.global.util.uploader.service.UploadService;

@Service
public class BlueprintService {
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;
	private final ProjectRepository projectRepository;
	private final PinService pinService;
	private final UploadService uploadService;

	@Autowired
	public BlueprintService(
		BlueprintRepository blueprintRepository,
		BlueprintVersionRepository blueprintVersionRepository,
		ProjectRepository projectRepository,
		PinService pinService,
		UploadService uploadService
	) {
		this.blueprintRepository = blueprintRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
		this.projectRepository = projectRepository;
		this.pinService = pinService;
		this.uploadService = uploadService;
	}

	public List<BlueprintDto> blueprints(Long projectId) {

		List<Blueprint> blueprintList =
			blueprintRepository.findAllByProjectProjectIdOrderByCreatedAtDesc(projectId);

		return blueprintList.stream()
			.map(blueprint -> {

				BlueprintVersion latestVersion =
					blueprintVersionRepository.findLatestVersion(blueprint.getBlueprintId());
				return new BlueprintDto(
					blueprint.getBlueprintId(),
					blueprint.getBlueprintTitle(),
					latestVersion.getBlueprintImg(),
					blueprint.getCreatedAt(),
					latestVersion.getBlueprintVersionId()
				);
			})
			.toList();
	}

	public List<BlueprintVersionItem> blueprintVersions(Long blueprintId) {


		List<BlueprintVersion> blueprintVersionList =
			blueprintVersionRepository.findAllByBlueprintBlueprintIdOrderByBlueprintVersionSeq(blueprintId);

		return blueprintVersionList.stream()
			.map(blueprintVersion -> new BlueprintVersionItem(
				blueprintVersion.getBlueprintVersionId(),
				blueprintVersion.getBlueprintVersionName(),
				blueprintVersion.getPreviewImg(),
				blueprintVersion.getCreatedAt(),
				blueprintVersion.getBlueprintVersionSeq()
			))
			.toList();
	}

	public BlueprintVersionDto blueprintSpec(Long blueprintId, Long versionId) {

		BlueprintVersion blueprintVersion =
			blueprintVersionRepository.findById(versionId).orElseThrow(BlueprintVersionNotFoundException::new);

		return BlueprintVersionDto.from(blueprintVersion);
	}

	@Transactional
	public CreateBlueprintResponseDto createBlueprint(
		Long projectId,
		CreateBlueprintRequestDto createBlueprintRequestDto
	) {
		Project targetProject =
			projectRepository.findById(projectId).orElseThrow(ProjectNotFoundException::new);

		Blueprint blueprint = Blueprint.builder()
			.project(targetProject)
			.blueprintTitle(createBlueprintRequestDto.blueprintTitle())
			.build();

		Blueprint savedBlueprint = blueprintRepository.save(blueprint);

		pinService.createDefaultPinGroup(savedBlueprint);

		BlueprintVersion savedBlueprintVersion = createBlueprintVersion(
			savedBlueprint,
			savedBlueprint.getBlueprintTitle(),
			createBlueprintRequestDto.originFile()
		);

		return new CreateBlueprintResponseDto(
			BlueprintDto.from(savedBlueprint, savedBlueprintVersion)
		);
	}

	@Transactional
	public CreateBlueprintVersionResponseDto createBlueprintVersion(
		Long blueprintId,
		CreateBlueprintVersionRequestDto createBlueprintVersionRequestDto
	) {
		Blueprint targetBlueprint =
			blueprintRepository.findById(blueprintId).orElseThrow(BlueprintNotFoundException::new);

		BlueprintVersion savedBlueprintVersion = createBlueprintVersion(
			targetBlueprint,
			createBlueprintVersionRequestDto.blueprintVersionName(),
			createBlueprintVersionRequestDto.originFile()
		);
		return new CreateBlueprintVersionResponseDto(
			BlueprintVersionItem.from(savedBlueprintVersion)
		);
	}

	@Transactional
	public BlueprintVersion createBlueprintVersion(
		Blueprint targetBlueprint,
		String blueprintVersionName,
		String originFile
	) {

		BlueprintVersion latestVersion =
			blueprintVersionRepository.findLatestVersion(targetBlueprint.getBlueprintId());

		int newSeq = 1;
		if (latestVersion != null) {
			newSeq += latestVersion.getBlueprintVersionSeq();
		}

		ImagePathDto imagePathDto = uploadService.getImagePath(originFile);

		BlueprintVersion blueprintVersion = BlueprintVersion.builder()
			.blueprint(targetBlueprint)
			.blueprintVersionName(blueprintVersionName)
			.originFile(originFile)
			.blueprintImg(imagePathDto.imagePath())
			.previewImg(imagePathDto.previewPath())
			.blueprintVersionSeq(newSeq)
			.build();

		BlueprintVersion savedBlueprintVersion =
			blueprintVersionRepository.save(blueprintVersion);

		if (savedBlueprintVersion.getBlueprintVersionSeq() != 1) {
			pinService.copyPreVersionPins(latestVersion, savedBlueprintVersion);
		}

		return savedBlueprintVersion;
	}

	public UpdateBlueprintResponseDto updateBlueprint(
		Long blueprintId,
		UpdateBlueprintRequestDto updateBlueprintRequestDto
	) {
		Blueprint blueprint =
			blueprintRepository.findById(blueprintId).orElseThrow(BlueprintNotFoundException::new);

		blueprint.setBlueprintTitle(updateBlueprintRequestDto.blueprintTitle());

		Blueprint savedBlueprint = blueprintRepository.save(blueprint);

		return new UpdateBlueprintResponseDto(
			savedBlueprint.getBlueprintId(),
			savedBlueprint.getBlueprintTitle()
		);
	}
}
