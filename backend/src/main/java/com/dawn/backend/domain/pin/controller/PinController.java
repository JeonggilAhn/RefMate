package com.dawn.backend.domain.pin.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
import com.dawn.backend.domain.pin.service.PinService;
import com.dawn.backend.global.response.ResponseWrapper;
import com.dawn.backend.global.response.ResponseWrapperFactory;

@RestController
public class PinController {
	private final PinService pinService;

	@Autowired
	public PinController(PinService pinService) {
		this.pinService = pinService;
	}

	@GetMapping("/blueprints/{blueprintId}/{versionId}/pins")
	@PreAuthorize("@authExpression.hasBlueprintPermission(blueprintId)")
	public ResponseEntity<ResponseWrapper<List<PinItem>>> getPinListByBlueprint(
		@PathVariable("blueprintId") Long blueprintId,
		@PathVariable("versionId") Long versionId,
		@RequestParam(value = "is_active", required = false) Boolean isActive
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.pins(versionId, isActive)
		);
	}

	@GetMapping("/pins/{pinId}/images")
	@PreAuthorize("@authExpression.hasPinPermission(pinId)")
	public ResponseEntity<ResponseWrapper<List<PinImageItem>>> getImagesByPin(
		@PathVariable("pinId") Long pinId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.pinImages(pinId)
		);
	}

	@GetMapping("/blueprints/{blueprintId}/pin-groups")
	@PreAuthorize("@authExpression.hasBlueprintPermission(blueprintId)")
	public ResponseEntity<ResponseWrapper<List<PinGroupDto>>> getPinGroups(
		@PathVariable("blueprintId") Long blueprintId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.pinGroups(blueprintId)
		);
	}

	@PostMapping("/blueprints/{blueprintId}/{versionId}/pins")
	@PreAuthorize("@authExpression.hasBlueprintPermission(blueprintId)")
	public ResponseEntity<ResponseWrapper<CreatePinResponseDto>> createPin(
		@PathVariable("blueprintId") Long blueprintId,
		@PathVariable("versionId") Long versionId,
		@RequestBody CreatePinRequestDto pinInfo
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.createPin(versionId, pinInfo)
		);
	}

	@PatchMapping("/pins/{pinId}/{versionId}/status")
	@PreAuthorize("@authExpression.hasPinPermission(pinId)")
	public ResponseEntity<ResponseWrapper<UpdatePinStatusResponseDto>> updatePinStatus(
			@PathVariable("pinId") Long pinId,
			@PathVariable("versionId") Long versionId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.updatePinStatus(pinId, versionId)
		);
	}

	@PatchMapping("/pins/{pinId}/name")
	@PreAuthorize("@authExpression.hasPinPermission(pinId)")
	public ResponseEntity<ResponseWrapper<UpdatePinNameResponseDto>> updatePinName(
			@PathVariable("pinId") Long pinId,
			@RequestBody UpdatePinNameRequestDto pinInfo
	) {
		return ResponseWrapperFactory.setResponse(
				HttpStatus.OK,
				null,
				pinService.updatePinName(pinId, pinInfo)
		);
	}

	@PatchMapping("/pins/{pinId}/{versionId}/group")
	@PreAuthorize("@authExpression.hasPinPermission(pinId)")
	public ResponseEntity<ResponseWrapper<UpdatePinGroupResponseDto>> updatePinGroup(
			@PathVariable("pinId") Long pinId,
			@PathVariable("versionId") Long versionId,
			@RequestBody UpdatePinGroupRequestDto pinInfo
	) {
		return ResponseWrapperFactory.setResponse(
				HttpStatus.OK,
				null,
				pinService.updatePinGroup(pinId, versionId, pinInfo)
		);
	}
}
