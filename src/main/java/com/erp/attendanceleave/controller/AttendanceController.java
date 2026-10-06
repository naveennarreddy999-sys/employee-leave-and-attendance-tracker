package com.erp.attendanceleave.controller;

import com.erp.attendanceleave.dto.AttendanceRequestDTO;
import com.erp.attendanceleave.model.Attendance;
import com.erp.attendanceleave.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// REST controller for attendance operations
@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Mark attendance for an employee
    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequestDTO dto) {
        try {
            Attendance saved = attendanceService.markAttendance(dto);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get all attendance records for a specific employee
    @GetMapping("/employee/{id}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployeeId(id));
    }

    // Get attendance percentage summary for an employee
    @GetMapping("/employee/{id}/percentage")
    public ResponseEntity<?> getAttendancePercentage(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(attendanceService.getAttendancePercentage(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
