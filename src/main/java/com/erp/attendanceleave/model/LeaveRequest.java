package com.erp.attendanceleave.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// Entity representing an employee's leave request
@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The employee who applied for leave
    @ManyToOne(optional = false)
    private Employee employee;

    private LocalDate fromDate;

    private LocalDate toDate;

    private String reason;

    // Status defaults to PENDING when a new request is created
    @Enumerated(EnumType.STRING)
    private LeaveStatus status = LeaveStatus.PENDING;
}
