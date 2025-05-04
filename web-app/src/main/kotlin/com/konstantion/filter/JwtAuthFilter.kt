package com.konstantion.filter

import com.konstantion.entity.UserEntity
import com.konstantion.service.AuthService
import com.konstantion.utils.Either
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.apache.commons.lang3.StringUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
data class JwtAuthFilter(
  private val authService: AuthService,
) : OncePerRequestFilter() {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  override fun doFilterInternal(
    request: HttpServletRequest,
    response: HttpServletResponse,
    filterChain: FilterChain
  ) {
    val authHeader: String? = request.getHeader("Authorization")

    if (StringUtils.isNotBlank(authHeader) && authHeader!!.startsWith("Bearer ")) {
      val token: String = authHeader.substring(7)
      when (val result = authService.extractUser(token)) {
        is Either.Left -> {
          log.error(
            "Error extracting user from token, code=${result.value.code()} message=${result.value.message()}"
          )
          SecurityContextHolder.clearContext()
          throw AuthenticationServiceException(result.value.message())
        }
        is Either.Right -> {
          val user: UserEntity = result.value
          val authentication = UsernamePasswordAuthenticationToken(user, null, mutableSetOf())
          authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
          SecurityContextHolder.getContext().authentication = authentication
        }
      }
    }

    filterChain.doFilter(request, response)
  }
}
