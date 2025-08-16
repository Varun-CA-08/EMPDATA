import React, { useState, useEffect } from 'react';
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from './services/employeeService.js';
import { getStats } from './Services/statsService.js';
import Swal from 'sweetalert2';

import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeSearch from './components/EmployeeSearch.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';
import AuthPage from './components/AuthPage.jsx';
import EmployeeNotifications from './components/EmployeeNotifications.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [editData, setEditData] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchStats();
    }
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(token);
      if (response.status !== 200) throw new Error();
      const data = response.data.filter(emp => emp && emp.name?.trim());
      setEmployees(data || []);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getStats(token);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, department } = form;
    if (!name || !email || !department) {
      return Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'All fields are required',
      });
    }

    try {
      const response = editData
        ? await updateEmployee(editData._id, { name, email, department }, token)
        : await addEmployee({ name, email, department }, token);

      if (![200, 201].includes(response.status)) throw new Error();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Employee ${editData ? 'updated' : 'added'} successfully!`,
      });

      setForm({ name: '', email: '', department: '' });
      setEditData(null);
      fetchEmployees();
      fetchStats();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleEdit = (emp) => {
    setEditData(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
    });
  };

  const handleDelete = async (emp) => {
    try {
      const response = await deleteEmployee(emp._id, token);
      if (response.status !== 200) throw new Error();

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Employee deleted successfully!',
      });

      fetchEmployees();
      fetchStats();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setIsSearching(true);

    try {
      const response = await getEmployeeById(searchId.trim(), token);
      if (response.status !== 200) throw new Error();
      setEmployees([response.data]);
    } catch {
      setEmployees([]);
      Swal.fire({
        icon: 'info',
        title: 'Not Found',
        text: `No employee found with ID ${searchId}`,
      });
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setIsSearching(false);
    fetchEmployees();
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <AuthPage onLogin={(user, token) => {
      setUser(user);
      setToken(token);
    }} />;
  }

  return (
  <div
    className="container-fluid py-4"
    style={{
      backgroundColor: '#e8f4f8',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>👋 Welcome, {user.name}</h2>
      <button className="btn btn-outline-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* Title */}
    <div className="mb-4">
      <h1 className="display-5 fw-bold">Employee Manager</h1>
      <p className="text-muted">Manage your organization’s team with ease</p>

      {/* Notifications below title */}
      <div style={{ backgroundColor: '#e8f4f8', marginTop: '1rem' }}>
        <EmployeeNotifications />
      </div>
    </div>

    {/* Form & Search */}
    <div className="row g-4">
      <div className="col-lg-6">
        <div
          className="card shadow-sm p-4"
          style={{ backgroundColor: '#dbe0e2ff' }}
        >
          <h5 className="mb-3">
            {editData ? '✏️ Edit Employee' : '➕ Add Employee'}
          </h5>
          <EmployeeForm
            form={form}
            editData={editData}
            handleChange={(e) =>
              setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            handleSubmit={handleSubmit}
            onCancel={() => {
              setForm({ name: '', email: '', department: '' });
              setEditData(null);
            }}
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div
          className="card shadow-sm p-4"
          style={{ backgroundColor: '#dbe0e2ff' }}
        >
          <h5 className="mb-3">🔍 Search by ID</h5>
          <EmployeeSearch
            searchId={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onSearch={handleSearch}
            onClear={clearSearch}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>

    {/* Table */}
    <div
      className="mt-5 card shadow-sm p-4"
      style={{
        backgroundColor: '#dbe0e2ff',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <h5 className="mb-3"> Employee List</h5>
      <EmployeeTable
        employees={employees}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>

    {/* Stats */}
    {stats && (
      <div
        className="mt-5 card shadow-sm p-4"
        style={{ backgroundColor: '#e9f5ff' }}
      >
        <h5 className="mb-4 text-primary">📈 API Usage Stats</h5>

        <div className="row">
          {Object.entries(stats).map(([key, value], idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div
                className="p-4 text-center border rounded"
                style={{
                  backgroundColor: '#dbe0e2ff',
                  borderColor: '#b6e0fe',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <div className="fw-semibold text-dark mb-2">
                  {key
                    .replace('analytics:', '')
                    .replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="badge bg-info fs-6">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}

export default App;
