package com.traafik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main Spring Boot application class for Traafik.
 * 
 * Traafik is a remote traffic stop management system that enables
 * secure, digital interaction between drivers and law enforcement officers.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableTransactionManagement
public class TraafikApplication {

    public static void main(String[] args) {
        SpringApplication.run(TraafikApplication.class, args);
    }
}