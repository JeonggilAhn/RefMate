package com.dawn.backend.global.utils.email.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.dawn.backend.global.utils.email.dto.EmailMessageRequestDto;
import com.dawn.backend.global.utils.email.service.EmailService;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

	private final EmailService emailService;

	@PostMapping("/send")
	public void sendMail(@RequestBody EmailMessageRequestDto emailMessageRequestDto) {
		emailService.sendMail(emailMessageRequestDto);
	}
}
