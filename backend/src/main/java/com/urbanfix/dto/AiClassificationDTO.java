package com.urbanfix.dto;

public class AiClassificationDTO {
    private String category;
    private String severity;
    private String structuredDescription;

    public AiClassificationDTO() {
    }

    public AiClassificationDTO(String category, String severity, String structuredDescription) {
        this.category = category;
        this.severity = severity;
        this.structuredDescription = structuredDescription;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStructuredDescription() {
        return structuredDescription;
    }

    public void setStructuredDescription(String structuredDescription) {
        this.structuredDescription = structuredDescription;
    }
}