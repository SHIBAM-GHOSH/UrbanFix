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

/**
 * FEYNMAN ANALOGY:
 * Think of this class as a Smart Front-Desk Officer at the City Hall.
 * When a citizen hands in a messy hand-written complaint, this officer doesn't guess what to do.
 * Instead, they package the complaint into an envelope, send it to a Super-Smart AI Expert (Groq Llama-3),
 * receive a neat assessment card (Category, Danger Level, Clean Summary), and hand it to the city engineers!
 */
@Service
public class AiServiceImpl implements AiService {

    //  THE VIP BADGE: Your secret pass key required to speak with the Groq AI Expert.
    @Value("${groq.api.key:${GROQ_API_KEY:}}")
    private String groqApiKey;

    //  THE POSTMAN & TRANSLATOR: RestTemplate sends mail over the internet; ObjectMapper translates JSON mail into Java objects.
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AiClassificationDTO classifyComplaint(String title, String description) {
        //  THE QUESTIONNAIRE: Clear instructions to the AI Expert telling them exactly how to grade the complaint.
        String prompt = String.format("""
            Analyze this civic report: Title: "%s", Description: "%s".
            1. category: Choose exactly one from ["Roads & Traffic", "Sanitation & Waste", "Water Supply", "Electrical & Lighting", "Public Parks", "Noise & Pollution", "Other"].
            2. severity: Choose exactly one from ["HIGH", "MEDIUM", "LOW"].
            3. structuredDescription: Write a clear, polite, professional 2-3 sentence summary string describing the civic issue and impact.
            Return a raw JSON object with string values for keys: "category", "severity", "structuredDescription".
            """, title, description);

        //  EXPRESS DELIVERY: Check if we have our VIP Badge before sending the request to Groq Headquarters.
        if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
            try {
                String groqUrl = "https://api.groq.com/openai/v1/chat/completions";
                Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.3-70b-versatile",
                    "messages", List.of(Map.of("role", "user", "content", prompt)),
                    "response_format", Map.of("type", "json_object")
                );

                //  SEALING THE ENVELOPE: Put JSON headers and attach our Secret VIP Bearer Badge.
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(groqApiKey.trim());

                //  POSTING THE LETTER: Send HTTPS POST and await AI reply.
                ResponseEntity<String> response = restTemplate.postForEntity(groqUrl, new HttpEntity<>(requestBody, headers), String.class);
                
                //  UNPACKING THE REPLY: Open the envelope and extract the AI's generated response text.
                JsonNode root = objectMapper.readTree(response.getBody());
                String jsonText = root.path("choices").get(0).path("message").path("content").asText();

                System.out.println("🤖 GROQ AI RESPONSE: " + jsonText);

                //  REPORT CARD: Parse JSON fields into a clean DTO object for our database.
                JsonNode jsonNode = objectMapper.readTree(jsonText);
                return new AiClassificationDTO(
                    jsonNode.path("category").asText("Roads & Traffic"),
                    jsonNode.path("severity").asText("MEDIUM"),
                    extractStructuredDescription(jsonNode, description)
                );
            } catch (Exception e) {
                //  ALARM BELL: If post office or AI network fails, print error and fall back smoothly.
                System.err.println(" GROQ API ERROR: " + e.getMessage());
            }
        }

        //  SAFETY NET: Default fallback if AI key is missing or internet is down (prevents server crashes!).
        return new AiClassificationDTO("Roads & Traffic", "MEDIUM", description);
    }

