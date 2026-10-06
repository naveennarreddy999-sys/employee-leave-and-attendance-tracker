import { useState, useEffect } from 'react';
import {
  getEmployees,
  applyLeave,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from '../api/client';

export default function LeavePage() {
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [empList, leaveList] = await Promise.all([
        getEmployees(),
        getPendingLeaves(),
      ]);
      setEmployees(empList);
      setPendingLeaves(leaveList);
    } catch (err) {
      setError(err.message || 'Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.employeeId) {
      setError('Please select an employee.');
      return;
    }

    setSubmitting(true);
    try {
      await applyLeave({
        employeeId: Number(formData.employeeId),
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
      });

      setSuccess('Leave application submitted successfully and is pending review.');
      setFormData({
        employeeId: '',
        fromDate: '',
        toDate: '',
        reason: '',
      });

      const updatedPending = await getPendingLeaves();
      setPendingLeaves(updatedPending);
    } catch (err) {
      setError(err.message || 'Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    setError('');
    setSuccess('');
    setActionLoadingId(id);
    try {
      await approveLeave(id);
      setSuccess(`Leave request #${id} approved successfully!`);
      setPendingLeaves((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to approve leave request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setError('');
    setSuccess('');
    setActionLoadingId(id);
    try {
      await rejectLeave(id);
      setSuccess(`Leave request #${id} rejected.`);
      setPendingLeaves((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to reject leave request');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="page-view">
      <div className="page-header">
        <h2>Leave Management</h2>
        <p className="page-description">
          Submit leave requests for employees and review or approve pending leave applications.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <div className="alert-content">{success}</div>
        </div>
      )}

      {/* Section A: Apply for Leave Form */}
      <div className="card">
        <div className="card-header">
          <h3>Apply for Leave</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleApplyLeave} className="form-grid">
            <div className="form-group">
              <label htmlFor="employeeId">Select Employee *</label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fromDate">From Date *</label>
              <input
                id="fromDate"
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="toDate">To Date *</label>
              <input
                id="toDate"
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason / Remarks *</label>
              <input
                id="reason"
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. Annual Vacation, Medical Emergency"
                required
              />
            </div>

            <div className="form-action">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <span className="btn-loading">
                    <span className="spinner-inline"></span> Submitting...
                  </span>
                ) : (
                  'Submit Leave Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Section B: Pending Leave Requests */}
      <div className="card">
        <div className="card-header flex-between">
          <h3>Pending Leave Requests</h3>
          <span className="badge badge-pending">{pendingLeaves.length} Pending</span>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading pending leave requests...</p>
            </div>
          ) : pendingLeaves.length === 0 ? (
            <div className="empty-state">
              <p className="no-data">No pending leave requests awaiting review.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{ width: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong>{req.employee?.name || 'Unknown'}</strong>
                        <div className="text-muted-small">{req.employee?.email}</div>
                      </td>
                      <td>{req.fromDate}</td>
                      <td>{req.toDate}</td>
                      <td>{req.reason}</td>
                      <td>
                        <span className="badge badge-pending">{req.status}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleApprove(req.id)}
                          >
                            {actionLoadingId === req.id ? '...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleReject(req.id)}
                          >
                            {actionLoadingId === req.id ? '...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
