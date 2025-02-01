package com.dawn.backend.domain.blueprint.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;
import com.dawn.backend.domain.blueprint.entity.Blueprint;
import com.dawn.backend.domain.blueprint.entity.BlueprintVersion;
import com.dawn.backend.domain.blueprint.repository.BlueprintRepository;
import com.dawn.backend.domain.blueprint.repository.BlueprintVersionRepository;

@Service
public class BlueprintService {
	private final BlueprintRepository blueprintRepository;
	private final BlueprintVersionRepository blueprintVersionRepository;

	@Autowired
	public BlueprintService(
		BlueprintRepository blueprintRepository,
		BlueprintVersionRepository blueprintVersionRepository
	) {
		this.blueprintRepository = blueprintRepository;
		this.blueprintVersionRepository = blueprintVersionRepository;
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
}
