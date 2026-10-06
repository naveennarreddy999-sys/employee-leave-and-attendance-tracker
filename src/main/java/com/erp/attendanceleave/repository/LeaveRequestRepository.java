package com.erp.attendanceleave.repository;

import com.erp.attendanceleave.model.LeaveRequest;
import com.erp.attendanceleave.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository for LeaveRequest with custom finders by status and employee
@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByStatus(LeaveStatus status);

    List<LeaveRequest> findByEmployeeId(Long employeeId);
}
