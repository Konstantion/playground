package com.konstantion.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {
    @Bean
    fun corsFilter(): CorsFilter {
        val configSource = UrlBasedCorsConfigurationSource()
        val corsConfig = CorsConfiguration()
        corsConfig.allowCredentials = true
        corsConfig.allowedOrigins = listOf("http://localhost:4200", "http://localhost:3000", "http://localhost:5173")
        corsConfig.allowedHeaders = listOf(
            "Origin", "Access-Control-Allow-Origin", "Content-Type",
            "Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
            "Access-Control-Request-Method", "Access-Control-Request-Headers"
        )
        corsConfig.exposedHeaders = listOf(
            "Origin",
            "Content-Type",
            "Accept",
            "Jwt-Token",
            "Authorization",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "File-Name"
        )
        corsConfig.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        configSource.registerCorsConfiguration("/**", corsConfig)
        return CorsFilter(configSource)
    }
}