package com.example.flocktest

/*
import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity

@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
                .csrf { csrf -> csrf.disable() } // Disable CSRF protection globally
                // .csrf { csrf -> csrf.ignoringAntMatchers("/api/**") } // Alternatively, disable CSRF only for /api/**
                .cors { } // Enable CORS with default settings, customize if needed

        return http.build()
    }
}*/