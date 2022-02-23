package com.catering.catering;

import com.catering.catering.repository.CatererRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class CateringApplication {

	@Autowired
    CatererRepo catRepo;

	public static void main(String[] args) {
		SpringApplication.run(CateringApplication.class, args);
	}

}
