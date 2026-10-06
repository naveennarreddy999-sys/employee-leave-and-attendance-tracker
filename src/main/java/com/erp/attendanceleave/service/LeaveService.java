package com.erp.attendanceleave.service;

import com.erp.attendanceleave.dto.LeaveApplicationDTO;
import com.erp.attendanceleave.model.Employee;
import com.erp.attendanceleave.model.LeaveRequest;
import com.erp.attendanceleave.model.LeaveStatus;
import com.erp.attendanceleave.repository.EmployeeRepository;
import com.erp.attendanceleave.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Service handling leave application, approval, and rejection logic
@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    // Apply for a new leave; validates employee existence and date order
    public LeaveRequest applyLeave(LeaveApplicationDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Employee not found with id: " + dto.getEmployeeId()));

        if (dto.getToDate().isBefore(dto.getFromDate())) {
            throw new IllegalArgumentException("toDate cannot be before fromDate");
        }

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(employee);
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setReason(dto.getReason());
        leave.setStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(leave);
    }

    // Get all leaves that are still pending
    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    // Get all leaves for a specific employee
    public List<LeaveRequest> getLeavesByEmployeeId(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    // Approve a leave request by id
    public LeaveRequest approveLeave(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Leave request not found with id: " + id));
        leave.setStatus(LeaveStatus.APPROVED);
        return leaveRequestRepository.save(leave);
    }

    // Reject a leave request by id
    public LeaveRequest rejectLeave(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Leave request not found with id: " + id));
        leave.setStatus(LeaveStatus.REJECTED);
        return leaveRequestRepository.save(leave);
    }
}
