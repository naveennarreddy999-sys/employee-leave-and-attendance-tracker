package com.erp.attendanceleave.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// DTO used to accept leave application input from the client
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveApplicationDTO {

    private Long employeeId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
}
