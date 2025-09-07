package com.traafik.dto.session;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSessionRequest {
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private String reason;
    
    private Double latitude;
    private Double longitude;
}