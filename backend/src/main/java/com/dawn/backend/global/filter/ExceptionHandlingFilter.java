package com.dawn.backend.global.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.dawn.backend.global.exception.BaseRuntimeException;
import com.dawn.backend.global.exception.CustomException;
import com.dawn.backend.global.exception.ExceptionCode;
import com.dawn.backend.global.response.ResponseWrapperFactory;

public class ExceptionHandlingFilter extends OncePerRequestFilter {
	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		try {
			doFilter(request, response, filterChain);
		} catch (BaseRuntimeException e) {
			CustomException customException = e.getClass().getAnnotation(CustomException.class);

			ExceptionCode exceptionCode = customException.value();

			ResponseWrapperFactory.setResponse(
				response,
				exceptionCode,
				null
			);
		}
	}
}
