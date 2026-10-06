package com.erp.attendanceleave.dto;

import com.erp.attendanceleave.model.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// DTO for marking attendance from the client
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestDTO {

    private Long employeeId;
    private LocalDate date;
    private AttendanceStatus status;
}
