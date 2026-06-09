package cabalgatas_salento.reservas.config;

import cabalgatas_salento.reservas.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Auth pública
                        .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
                        // Lectura pública de rutas
                        .requestMatchers(HttpMethod.GET, "/rutas/**").permitAll()
                        // Gestión de caballos — solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/caballos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/caballos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/caballos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/caballos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/caballos/**").hasRole("ADMIN")
                        // Gestión de guías — solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/guias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/guias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/guias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/guias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/guias/**").hasRole("ADMIN")
                        // Gestión de rutas — solo ADMIN
                        .requestMatchers(HttpMethod.POST, "/rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/rutas/**").hasRole("ADMIN")
                        // Gestión de salidas — solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/salidas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/salidas/**").hasRole("ADMIN")
                        // Reservaciones de admin
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
