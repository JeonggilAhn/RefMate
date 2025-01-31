package com.dawn.backend.global.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseWrapper<T>(
	Status status,
	T content,
	Metadata metadata
) {
	public record Status(
		String code,
		String message
	) { }

	public record Metadata(
		String timestamp,
		String path,
		String version
	) { }

	public ResponseWrapper(
		ResponseCode responseCode,
		T content
	) {
		this(
			new Status(
				responseCode.getCode(),
				responseCode.getMessage()
			),
			content,
			new Metadata(
				LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
				ServletUriComponentsBuilder.fromCurrentRequestUri().toUriString(),
				"1.0.0"
			)
		);
	}
}
