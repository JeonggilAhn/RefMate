package com.dawn.backend.global.util.email.service;


import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.dawn.backend.global.util.email.dto.EmailMessageRequestDto;
import com.dawn.backend.global.util.email.exception.EmailSendFailedException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender javaMailSender;

	public void sendMail(EmailMessageRequestDto emailMessageRequestDto) {

		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

		try {
			MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
			mimeMessageHelper.setTo(emailMessageRequestDto.to());
			mimeMessageHelper.setSubject(emailMessageRequestDto.subject());
			mimeMessageHelper.setText(emailMessageRequestDto.message(), true);
			javaMailSender.send(mimeMessage);

			log.info("Success");
		} catch (MessagingException e) {
			log.info("fail");
			throw new EmailSendFailedException();
		}
	}
}
