package com.erp.attendanceleave.repository;

import com.erp.attendanceleave.model.Attendance;
import com.erp.attendanceleave.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// Repository for Attendance with finders by employee, date, and status
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeIdAndDate(Long employeeId, LocalDate date);

    long countByEmployeeId(Long employeeId);

    long countByEmployeeIdAndStatus(Long employeeId, AttendanceStatus status);
}
