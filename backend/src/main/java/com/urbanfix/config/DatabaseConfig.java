package com.urbanfix.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String cleanUrl = rawUrl.trim();
        String extractedUser = username != null ? username.trim() : "";
        String extractedPass = password != null ? password.trim() : "";

        // Normalize postgres:// or postgresql:// to jdbc:postgresql://
        if (cleanUrl.startsWith("postgres://")) {
            cleanUrl = "jdbc:postgresql://" + cleanUrl.substring("postgres://".length());
        } else if (cleanUrl.startsWith("postgresql://")) {
            cleanUrl = "jdbc:postgresql://" + cleanUrl.substring("postgresql://".length());
        } else if (!cleanUrl.startsWith("jdbc:")) {
            cleanUrl = "jdbc:" + cleanUrl;
        }

        // Handle PostgreSQL JDBC driver quirk with embedded user:pass@host
        if (cleanUrl.startsWith("jdbc:postgresql://") && cleanUrl.contains("@")) {
            try {
                String prefix = "jdbc:postgresql://";
                String rest = cleanUrl.substring(prefix.length());
                int atIndex = rest.indexOf('@');
                String userInfo = rest.substring(0, atIndex);
                String hostAndDb = rest.substring(atIndex + 1);

                if (userInfo.contains(":")) {
                    String[] userPass = userInfo.split(":", 2);
                    if (extractedUser.isEmpty()) {
                        extractedUser = userPass[0];
                    }
                    if (extractedPass.isEmpty()) {
                        extractedPass = userPass[1];
                    }
                }

                cleanUrl = prefix + hostAndDb;
            } catch (Exception ignored) {
            }
        }

        DataSourceBuilder<?> builder = DataSourceBuilder.create()
                .url(cleanUrl);

        if (!extractedUser.isEmpty()) {
            builder.username(extractedUser);
        }
        if (!extractedPass.isEmpty()) {
            builder.password(extractedPass);
        }

        return builder.build();
    }
}
