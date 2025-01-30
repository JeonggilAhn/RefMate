package com.dawn.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
@SpringBootApplication
public class DawnBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DawnBackendApplication.class, args);
	}

}
