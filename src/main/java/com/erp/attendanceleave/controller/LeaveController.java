package com.erp.attendanceleave.controller;

import com.erp.attendanceleave.dto.LeaveApplicationDTO;
import com.erp.attendanceleave.model.LeaveRequest;
import com.erp.attendanceleave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// REST controller for leave request operations
@RestController
@RequestMapping("/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    // Apply for a new leave
    @PostMapping
    public ResponseEntity<?> applyLeave(@RequestBody LeaveApplicationDTO dto) {
        try {
            LeaveRequest saved = leaveService.applyLeave(dto);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get all pending leave requests
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    // Get all leaves for a specific employee
    @GetMapping("/employee/{id}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployeeId(id));
    }

    // Approve a leave request
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(leaveService.approveLeave(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Reject a leave request
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(leaveService.rejectLeave(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
