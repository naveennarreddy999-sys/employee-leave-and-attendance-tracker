import { useState, useEffect } from 'react';
import {
  getEmployees,
  markAttendance,
  getAttendancePercentage,
} from '../api/client';

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const empList = await getEmployees();
      setEmployees(empList);

      const initialMap = {};
      empList.forEach((emp) => {
        initialMap[emp.id] = 'PRESENT';
      });
      setAttendanceMap(initialMap);

      await loadStatsForEmployees(empList);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const loadStatsForEmployees = async (empList) => {
    try {
      const statsPromises = empList.map(async (emp) => {
        try {
          const stat = await getAttendancePercentage(emp.id);
          return { id: emp.id, stat };
        } catch {
          return {
            id: emp.id,
            stat: { totalDays: 0, presentDays: 0, percentage: 0 },
          };
        }
      });

      const results = await Promise.all(statsPromises);
      const newStats = {};
      results.forEach(({ id, stat }) => {
        newStats[id] = stat;
      });
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (employeeId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [employeeId]: status,
    }));
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (employees.length === 0) return;

    setSaving(true);
    setError('');
    setSuccess('');

    let successCount = 0;
    const failures = [];

    for (const emp of employees) {
      const status = attendanceMap[emp.id] || 'PRESENT';
      try {
        await markAttendance({
          employeeId: emp.id,
          date: selectedDate,
          status: status,
        });
        successCount++;
      } catch (err) {
        failures.push(`${emp.name}: ${err.message}`);
      }
    }

    if (failures.length === 0) {
      setSuccess(`Attendance recorded successfully for all ${successCount} employee(s) on ${selectedDate}.`);
    } else if (successCount > 0) {
      setSuccess(`Attendance recorded for ${successCount} employee(s).`);
      setError(`Notice for some records:\n${failures.join('\n')}`);
    } else {
      setError(failures.join('\n'));
    }

    await loadStatsForEmployees(employees);
    setSaving(false);
  };

  return (
    <div className="page-view">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <p className="page-description">
          Mark daily attendance for faculty and staff, and monitor attendance metrics and percentages.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content" style={{ whiteSpace: 'pre-line' }}>{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <div className="alert-content">{success}</div>
        </div>
      )}

      {/* Section A: Mark Daily Attendance */}
      <div className="card">
        <div className="card-header flex-between">
          <h3>Mark Daily Attendance</h3>
          <div className="form-group-inline">
            <label htmlFor="attendanceDate">Attendance Date:</label>
            <input
              id="attendanceDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading attendance roster...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p className="no-data">No employees found. Please register employees first.</p>
            </div>
          ) : (
            <form onSubmit={handleSaveAttendance}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th style={{ width: '220px' }}>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const currentStatus = attendanceMap[emp.id] || 'PRESENT';
                      return (
                        <tr key={emp.id}>
                          <td>
                            <strong>{emp.name}</strong>
                            <div className="text-muted-small">{emp.email}</div>
                          </td>
                          <td>{emp.department || <span className="text-muted">—</span>}</td>
                          <td>
                            <div className="radio-group">
                              <label className={`radio-label ${currentStatus === 'PRESENT' ? 'selected-present' : ''}`}>
                                <input
                                  type="radio"
                                  name={`status-${emp.id}`}
                                  value="PRESENT"
                                  checked={currentStatus === 'PRESENT'}
                                  onChange={() => handleStatusChange(emp.id, 'PRESENT')}
                                />
                                Present
                              </label>

                              <label className={`radio-label ${currentStatus === 'ABSENT' ? 'selected-absent' : ''}`}>
                                <input
                                  type="radio"
                                  name={`status-${emp.id}`}
                                  value="ABSENT"
                                  checked={currentStatus === 'ABSENT'}
                                  onChange={() => handleStatusChange(emp.id, 'ABSENT')}
                                />
                                Absent
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="form-action" style={{ marginTop: '16px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="btn-loading">
                      <span className="spinner-inline"></span> Saving Records...
                    </span>
                  ) : (
                    'Save Attendance'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Section B: Attendance Statistics */}
      <div className="card">
        <div className="card-header">
          <h3>Attendance Statistics</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Calculating attendance metrics...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p className="no-data">No employee statistics available.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Total Marked Days</th>
                    <th>Present Days</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const empStat = stats[emp.id] || { totalDays: 0, presentDays: 0, percentage: 0 };
                    const pct = typeof empStat.percentage === 'number'
                      ? empStat.percentage.toFixed(1)
                      : '0.0';

                    return (
                      <tr key={emp.id}>
                        <td>
                          <strong>{emp.name}</strong>
                          <div className="text-muted-small">{emp.designation || 'Staff'}</div>
                        </td>
                        <td>{emp.department || <span className="text-muted">—</span>}</td>
                        <td>{empStat.totalDays}</td>
                        <td>{empStat.presentDays}</td>
                        <td>
                          <span className={`badge ${empStat.percentage >= 75 ? 'badge-success' : 'badge-warning'}`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
