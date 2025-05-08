'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login podaci:', formData);
    // Ovdje ide poziv prema backendu
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

        <button type="submit" className={styles.button}>
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Login;
