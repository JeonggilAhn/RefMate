package com.dawn.backend.domain.pin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dawn.backend.domain.pin.dto.PinItem;
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
	public ResponseEntity<ResponseWrapper<List<PinItem>>> getPinListByBlueprint(
		@PathVariable("blueprintId") Long blueprintId,
		@PathVariable("versionId") Long versionId
	) {
		return ResponseWrapperFactory.setResponse(
			HttpStatus.OK,
			null,
			pinService.pins(blueprintId, versionId)
		);
	}
}
