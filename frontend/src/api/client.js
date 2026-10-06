const BASE_URL = 'http://localhost:8080';

/**
 * Fetch all employees
 */
export async function getEmployees() {
  const response = await fetch(`${BASE_URL}/employees`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch employees: ${response.status}`);
  }
  return response.json();
}

/**
 * Create a new employee
 * @param {Object} data - { name, email, department, designation }
 */
export async function createEmployee(data) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create employee: ${response.status}`);
  }
  return response.json();
}

/**
 * Apply for leave
 * @param {Object} data - { employeeId, fromDate, toDate, reason }
 */
export async function applyLeave(data) {
  const response = await fetch(`${BASE_URL}/leaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to apply for leave: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch all pending leave requests
 */
export async function getPendingLeaves() {
  const response = await fetch(`${BASE_URL}/leaves/pending`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch pending leaves: ${response.status}`);
  }
  return response.json();
}

/**
 * Approve a leave request
 * @param {number|string} id - Leave request ID
 */
export async function approveLeave(id) {
  const response = await fetch(`${BASE_URL}/leaves/${id}/approve`, {
    method: 'PUT',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to approve leave: ${response.status}`);
  }
  return response.json();
}

/**
 * Reject a leave request
 * @param {number|string} id - Leave request ID
 */
export async function rejectLeave(id) {
  const response = await fetch(`${BASE_URL}/leaves/${id}/reject`, {
    method: 'PUT',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to reject leave: ${response.status}`);
  }
  return response.json();
}

/**
 * Mark attendance for an employee
 * @param {Object} data - { employeeId, date, status }
 */
export async function markAttendance(data) {
  const response = await fetch(`${BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to mark attendance: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch attendance percentage for an employee
 * @param {number|string} employeeId
 */
export async function getAttendancePercentage(employeeId) {
  const response = await fetch(`${BASE_URL}/attendance/employee/${employeeId}/percentage`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch attendance percentage: ${response.status}`);
  }
  return response.json();
}
