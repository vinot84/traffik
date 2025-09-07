package com.traafik.dto.session;

import com.traafik.entity.Session;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSessionStatusRequest {
    
    @NotNull(message = "Status is required")
    private Session.Status status;
    
    private String reason;
}