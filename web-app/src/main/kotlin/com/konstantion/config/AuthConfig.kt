package com.konstantion.config

import com.konstantion.filter.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
class AuthConfig {
  @Bean
  fun securityFilterChain(
    http: HttpSecurity,
    jwtFilter: JwtAuthFilter,
  ): SecurityFilterChain =
    http
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers("/api/auth/**")
          .permitAll()
          .requestMatchers(
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/v2/api-docs",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/webjars/**",
          )
          .permitAll()
          .anyRequest()
          .authenticated()
      }
      .sessionManagement { session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      }
      .exceptionHandling { handling ->
        handling.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
      }
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
      .csrf { csrf -> csrf.disable() }
      .build()
}
