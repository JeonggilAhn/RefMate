package com.dawn.backend.domain.blueprint.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;
import com.dawn.backend.domain.blueprint.dto.request.CreateBlueprintRequestDto;
import com.dawn.backend.domain.blueprint.dto.response.CreateBlueprintResponseDto;
import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;
import com.dawn.backend.domain.project.entity.Project;
import com.dawn.backend.domain.project.repository.ProjectRepository;

@Service
public class BlueprintService {
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;
	private final ProjectRepository projectRepository;

	@Autowired
	public BlueprintService(
		BlueprintRepository blueprintRepository,
		BlueprintVersionRepository blueprintVersionRepository,
		ProjectRepository projectRepository
	) {
		this.blueprintRepository = blueprintRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
		this.projectRepository = projectRepository;
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
					blueprint.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME),
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
				blueprintVersion.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME),
				blueprintVersion.getBlueprintVersionSeq()
			))
			.toList();
	}

	public BlueprintVersionDto blueprintSpec(Long blueprintId, Long versionId) {

		BlueprintVersion blueprintVersion =
			blueprintVersionRepository.findById(versionId).orElse(null);

		return new BlueprintVersionDto(
			blueprintVersion.getBlueprintVersionId(),
			blueprintVersion.getBlueprintVersionName(),
			blueprintVersion.getBlueprintImg()
		);
	}

	@Transactional
	public CreateBlueprintResponseDto createBlueprint(
		Long projectId,
		CreateBlueprintRequestDto createBlueprintRequestDto
	) {
		Project targetProject =
			projectRepository.findById(projectId).orElse(null);

		Blueprint blueprint = Blueprint.builder()
			.project(targetProject)
			.blueprintTitle(createBlueprintRequestDto.blueprintTitle())
			.build();

		Blueprint savedBlueprint = blueprintRepository.save(blueprint);

		return new CreateBlueprintResponseDto(
			savedBlueprint.getBlueprintId(),
			createBlueprintVersion(
				savedBlueprint,
				savedBlueprint.getBlueprintTitle(),
				createBlueprintRequestDto.originFile()
			)
		);
	}

	@Transactional
	public Long createBlueprintVersion(
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

		BlueprintVersion blueprintVersion = BlueprintVersion.builder()
			.blueprint(targetBlueprint)
			.blueprintVersionName(blueprintVersionName)
			.originFile(originFile)
			.blueprintImg(null)
			.previewImg(null)
			.preBlueprintVersion(latestVersion)
			.blueprintVersionSeq(newSeq)
			.build();

		BlueprintVersion savedBlueprintVersion =
			blueprintVersionRepository.save(blueprintVersion);

		blueprintVersionRepository.updatePostVersion(latestVersion, savedBlueprintVersion);

		return savedBlueprintVersion.getBlueprintVersionId();
	}
}
