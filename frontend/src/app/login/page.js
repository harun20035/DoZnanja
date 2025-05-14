'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Nevalidni podaci');
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        console.log('Uspješan login, token je sačuvan.');
        window.location.href = 'creator';
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Greška prilikom prijave:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Prijava</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          required
        />

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <button type="submit" className={styles.button}>
          Prijavi se
        </button>

        <a href="http://localhost:8000/users/google/login" className={styles.googleButton}>
            <FaGoogle className={styles.googleLogo} /> Prijavi se sa Google
        </a>
      </form>
    </div>
  );
};

export default Login;
