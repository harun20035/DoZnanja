'use client';

import React, { useState, useEffect } from 'react';
import './login.css';
import { FaGoogle, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setShowErrorModal(false);

    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const poruka =
          data.detail?.toLowerCase() === 'invalid credentials'
            ? 'Nevalidni podaci'
            : data.detail || 'Greška prilikom prijave';

        throw new Error(poruka);
      }

      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);

        // Fetch user data
        const userRes = await fetch('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });
        if (userRes.ok) {
          const user = await userRes.json();
          localStorage.setItem('user_data', JSON.stringify(user));
        }

        window.location.href = '/user/dashboard';
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-fields">
        <h2 className="form-title">Prijava</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Prijava u toku...' : 'Prijavi se'}
        </button>

        <a
          href="http://localhost:8000/users/google/login?redirect_uri=http://localhost:3000/google/callback"
          className="google-button"
        >
        <FaGoogle className="google-icon" /> Prijavi se sa Google
        </a>

      </form>

      {showErrorModal && (
        <div className="modal-popup">
          <div className="modal-content">
            <FaExclamationCircle className="modal-icon" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
