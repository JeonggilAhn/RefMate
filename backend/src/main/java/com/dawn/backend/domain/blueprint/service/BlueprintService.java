package com.dawn.backend.domain.blueprint.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
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

		List<Blueprint> blueprintList = blueprintRepository.findAllByProjectProjectId(projectId);

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
}
