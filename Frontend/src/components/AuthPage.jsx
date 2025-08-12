import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { registerUser, loginUser } from '../Services/authService';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields',
      });
    }

    try {
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: form.name, email: form.email, password: form.password });

      if (![200, 201].includes(response.status)) throw new Error();

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire({
        icon: 'success',
        title: isLogin ? 'Login successful' : 'Registration successful',
      });

      onLogin(user, token);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-3">{isLogin ? 'Welcome Back' : 'Create an Account'}</h3>

        {isLogin && (
          <div className="text-muted text-center mb-3" style={{ fontSize: '0.85rem' }}>
            Only 3 login attempts allowed. After that, your account will be locked for 2 minutes.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="name"
                id="nameInput"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
              <label htmlFor="nameInput">Name</label>
            </div>
          )}
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              id="emailInput"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <label htmlFor="emailInput">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              name="password"
              id="passwordInput"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <label htmlFor="passwordInput">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="btn btn-sm btn-link p-0"
              onClick={() => {
                setIsLogin(!isLogin);
                setForm({ name: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

