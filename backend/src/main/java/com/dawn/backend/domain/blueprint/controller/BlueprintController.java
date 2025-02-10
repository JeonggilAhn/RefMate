package com.dawn.backend.domain.blueprint.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dawn.backend.domain.blueprint.dto.BlueprintDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionDto;
import com.dawn.backend.domain.blueprint.dto.BlueprintVersionItem;
import com.dawn.backend.domain.blueprint.dto.request.CreateBlueprintRequestDto;
import com.dawn.backend.domain.blueprint.dto.request.CreateBlueprintVersionRequestDto;
import com.dawn.backend.domain.blueprint.dto.request.UpdateBlueprintRequestDto;
import com.dawn.backend.domain.blueprint.dto.response.CreateBlueprintResponseDto;
import com.dawn.backend.domain.blueprint.dto.response.CreateBlueprintVersionResponseDto;
import com.dawn.backend.domain.blueprint.dto.response.UpdateBlueprintResponseDto;
import com.dawn.backend.domain.blueprint.service.BlueprintService;
import com.dawn.backend.domain.note.service.ReadCheckService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
public class BlueprintController {
	private final BlueprintService blueprintService;
	private final ReadCheckService readCheckService;

	@Autowired
	public BlueprintController(BlueprintService blueprintService, ReadCheckService readCheckService) {
		this.blueprintService = blueprintService;
		this.readCheckService = readCheckService;
	}

	@GetMapping("/projects/{projectId}/blueprints")
	@PreAuthorize("@authExpression.hasProjectPermissionByProjectId(#projectId)")
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
	@PreAuthorize("@authExpression.hasBlueprintPermission(#blueprintId)")
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
	@PreAuthorize("@authExpression.hasBlueprintPermission(#blueprintId)")
	public ResponseEntity<ResponseWrapper<BlueprintVersionDto>> getBlueprintSpec(
		@PathVariable("blueprintId") Long blueprintId,
		@PathVariable("versionId") Long versionId
	) {
		readCheckService.startSseEmitter(blueprintId);
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			blueprintService.blueprintSpec(blueprintId, versionId)
		);
	}

	@PostMapping("/projects/{projectId}/blueprints")
	@PreAuthorize("@authExpression.hasProjectPermissionByProjectId(#projectId)")
	public ResponseEntity<ResponseWrapper<CreateBlueprintResponseDto>> addBlueprint(
		@PathVariable("projectId") Long projectId,
		@RequestBody CreateBlueprintRequestDto createBlueprintRequestDto
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.CREATED,
			null,
			blueprintService.createBlueprint(projectId, createBlueprintRequestDto)
		);
	}

	@PostMapping("/blueprints/{blueprintId}")
	@PreAuthorize("@authExpression.hasBlueprintPermission(#blueprintId)")
	public ResponseEntity<ResponseWrapper<CreateBlueprintVersionResponseDto>> addBlueprintVersion(
		@PathVariable("blueprintId") Long blueprintId,
		@RequestBody CreateBlueprintVersionRequestDto createBlueprintVersionRequestDto
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.CREATED,
			null,
			blueprintService.createBlueprintVersion(blueprintId, createBlueprintVersionRequestDto)
		);
	}

	@PatchMapping("/blueprints/{blueprintId}")
	@PreAuthorize("@authExpression.hasBlueprintPermission(#blueprintId)")
	public ResponseEntity<ResponseWrapper<UpdateBlueprintResponseDto>> updateBlueprint(
		@PathVariable("blueprintId") Long blueprintId,
		@RequestBody UpdateBlueprintRequestDto updateBlueprintRequestDto
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			blueprintService.updateBlueprint(
				blueprintId,
				updateBlueprintRequestDto
			)
		);
	}
}
