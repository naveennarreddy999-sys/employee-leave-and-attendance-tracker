import { useState, useEffect } from 'react';
import { getEmployees, createEmployee } from '../api/client';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const created = await createEmployee(formData);
      setSuccess(`Employee "${created.name}" added successfully!`);
      setFormData({
        name: '',
        email: '',
        department: '',
        designation: '',
      });
      await fetchEmployees();
    } catch (err) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-view">
      <div className="page-header">
        <h2>Employee Directory</h2>
        <p className="page-description">
          Add new faculty and staff members, and view all registered personnel.
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

      {/* Add Employee Form Card */}
      <div className="card">
        <div className="card-header">
          <h3>Add New Employee</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Alan Turing"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. turing@university.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Professor / Lecturer"
              />
            </div>

            <div className="form-action">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <span className="btn-loading">
                    <span className="spinner-inline"></span> Saving...
                  </span>
                ) : (
                  'Add Employee'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="card">
        <div className="card-header flex-between">
          <h3>Registered Employees</h3>
          <span className="badge badge-neutral">{employees.length} Total</span>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading employee directory...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p className="no-data">No employees registered yet. Use the form above to add an employee.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="text-muted-bold">#{emp.id}</td>
                      <td>
                        <strong>{emp.name}</strong>
                      </td>
                      <td>{emp.email}</td>
                      <td>{emp.department || <span className="text-muted">—</span>}</td>
                      <td>{emp.designation || <span className="text-muted">—</span>}</td>
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
