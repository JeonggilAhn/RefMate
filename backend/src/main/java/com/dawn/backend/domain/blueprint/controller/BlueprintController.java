package com.dawn.backend.domain.blueprint.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;
import com.dawn.backend.domain.blueprint.service.BlueprintService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
public class BlueprintController {
	private final BlueprintService blueprintService;

	@Autowired
	public BlueprintController(BlueprintService blueprintService) {
		this.blueprintService = blueprintService;
	}

	@GetMapping("/projects/{projectId}/blueprints")
	public ResponseEntity<ResponseWrapper<List<BlueprintDto>>> getBlueprints(
		@PathVariable("projectId") Long projectId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			blueprintService.blueprints(projectId)
		);
	}

	@GetMapping("/blueprints/{blueprintId}")
	public ResponseEntity<ResponseWrapper<List<BlueprintVersionItem>>> getBlueprint(
		@PathVariable("blueprintId") Long blueprintId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			blueprintService.blueprintVersions(blueprintId)
		);
	}

	@GetMapping("/blueprints/{blueprintId}/{versionId}")
	public ResponseEntity<ResponseWrapper<BlueprintVersionDto>> getBlueprintSpec(
		@PathVariable("blueprintId") Long blueprintId,
		@PathVariable("versionId") Long versionId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			blueprintService.blueprintSpec(blueprintId, versionId)
		);
	}

}
