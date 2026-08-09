package com.urbanfix.service.Implementation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanfix.dto.AiClassificationDTO;
import com.urbanfix.service.InterFaces.AiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {

    @Value("${groq.api.key:${GROQ_API_KEY:}}")
    private String groqApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AiClassificationDTO classifyComplaint(String title, String description) {
        String prompt = String.format("""
            Analyze this civic report: Title: "%s", Description: "%s".
            1. category: Choose exactly one from ["Roads & Traffic", "Sanitation & Waste", "Water Supply", "Electrical & Lighting", "Public Parks", "Noise & Pollution", "Other"].
            2. severity: Choose exactly one from ["HIGH", "MEDIUM", "LOW"].
            3. structuredDescription: Write a clear, polite, professional 2-3 sentence summary string describing the civic issue and impact.
            Return a raw JSON object with string values for keys: "category", "severity", "structuredDescription".
            """, title, description);

        // Call Groq Llama-3.3 70B API
        if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
            try {
                String groqUrl = "https://api.groq.com/openai/v1/chat/completions";
                Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.3-70b-versatile",
                    "messages", List.of(Map.of("role", "user", "content", prompt)),
                    "response_format", Map.of("type", "json_object")
                );

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(groqApiKey.trim());

                ResponseEntity<String> response = restTemplate.postForEntity(groqUrl, new HttpEntity<>(requestBody, headers), String.class);
                JsonNode root = objectMapper.readTree(response.getBody());
                String jsonText = root.path("choices").get(0).path("message").path("content").asText();

                System.out.println("🤖 GROQ AI RESPONSE: " + jsonText);

                JsonNode jsonNode = objectMapper.readTree(jsonText);
                return new AiClassificationDTO(
                    jsonNode.path("category").asText("Roads & Traffic"),
                    jsonNode.path("severity").asText("MEDIUM"),
                    extractStructuredDescription(jsonNode, description)
                );
            } catch (Exception e) {
                System.err.println("⚠️ GROQ API ERROR: " + e.getMessage());
            }
        }

        // Fallback default if Groq key is missing or call fails
        return new AiClassificationDTO("Roads & Traffic", "MEDIUM", description);
    }

    private String extractStructuredDescription(JsonNode jsonNode, String defaultDescription) {
        JsonNode descNode = jsonNode.path("structuredDescription");
        if (descNode.isObject()) {
            StringBuilder sb = new StringBuilder();
            descNode.fields().forEachRemaining(entry -> {
                String key = entry.getKey();
                String capitalizedKey = key.substring(0, 1).toUpperCase() + key.substring(1);
                sb.append(capitalizedKey).append(": ").append(entry.getValue().asText()).append(". ");
            });
            return sb.toString().trim();
        }
        if (descNode.isTextual() && !descNode.asText().isEmpty()) {
            return descNode.asText();
        }
        return defaultDescription;
    }
}
