package com.erp.attendanceleave.service;

import com.erp.attendanceleave.dto.AttendancePercentageDTO;
import com.erp.attendanceleave.dto.AttendanceRequestDTO;
import com.erp.attendanceleave.model.Attendance;
import com.erp.attendanceleave.model.AttendanceStatus;
import com.erp.attendanceleave.model.Employee;
import com.erp.attendanceleave.repository.AttendanceRepository;
import com.erp.attendanceleave.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Service handling attendance marking and percentage calculation
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    // Mark attendance for an employee; prevents duplicates on the same date
    public Attendance markAttendance(AttendanceRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Employee not found with id: " + dto.getEmployeeId()));

        if (attendanceRepository.existsByEmployeeIdAndDate(dto.getEmployeeId(), dto.getDate())) {
            throw new IllegalArgumentException(
                    "Attendance already marked for this employee on " + dto.getDate());
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(dto.getDate());
        attendance.setStatus(dto.getStatus());

        return attendanceRepository.save(attendance);
    }

    // Get all attendance records for a specific employee
    public List<Attendance> getAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    // Calculate attendance percentage for an employee
    public AttendancePercentageDTO getAttendancePercentage(Long employeeId) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Employee not found with id: " + employeeId));

        long totalDays = attendanceRepository.countByEmployeeId(employeeId);
        if (totalDays == 0) {
            return new AttendancePercentageDTO(employeeId, 0, 0, 0.0);
        }

        long presentDays = attendanceRepository.countByEmployeeIdAndStatus(
                employeeId, AttendanceStatus.PRESENT);
        double percentage = ((double) presentDays / totalDays) * 100.0;

        return new AttendancePercentageDTO(employeeId, totalDays, presentDays, percentage);
    }
}
