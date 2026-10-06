package com.erp.attendanceleave.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for returning attendance percentage summary
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancePercentageDTO {

    private Long employeeId;
    private long totalDays;
    private long presentDays;
    private double percentage;
}
