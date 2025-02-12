package com.dawn.backend.global.util.email.service;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.global.util.email.dto.EmailMessageRequestDto;
import com.dawn.backend.global.util.email.exception.EmailSendFailedException;
import com.dawn.backend.global.util.email.exception.EmailTemplateReadFailedException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
	@Value("${front-url}")
	private String frontUrl;

	private final JavaMailSender javaMailSender;

	public void sendMail(EmailMessageRequestDto emailMessageRequestDto, String projectTitle,
						String grantToken, String unauthorizedGrantToken, Long projectId) {

		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

		try {
			String content = readHtmlTemplate("mail/mail.html");

			// login 페이지 url 확정 시 추가예정
			String inviteLink = "?grant_token=" + grantToken;
			String unauthorizedInviteLink = frontUrl + "/#/projects/" + projectId + "/blueprints"
				+ "?presigned=" + unauthorizedGrantToken;
			content = content
				.replace("{projectTitle}", projectTitle)
				.replace("{inviteLink}", inviteLink)
				.replace("{unauthorizedInviteLink}", unauthorizedInviteLink);
			MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
			mimeMessageHelper.setTo(emailMessageRequestDto.to());
			mimeMessageHelper.setSubject(emailMessageRequestDto.subject());
			mimeMessageHelper.setText(content, true);

			javaMailSender.send(mimeMessage);

			log.info("Success");
		} catch (MessagingException e) {
			log.info("fail");
			throw new EmailSendFailedException();
		}
	}

	private String readHtmlTemplate(String filePath) {
		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(new ClassPathResource(filePath).getInputStream(), StandardCharsets.UTF_8))) {
			return reader.lines().collect(Collectors.joining("\n"));
		} catch (IOException e) {
			throw new EmailTemplateReadFailedException();
		}
	}

}
