'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registracija:', formData);
    // Ovdje ide poziv prema backendu
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Registracija</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Ime"
          className={styles.input}
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Prezime"
          className={styles.input}
          value={formData.lastName}
          onChange={handleChange}
          required
        />

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

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={formData.role === 'user'}
              onChange={handleChange}
              className={styles.radio}
            />
            Korisnik
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="role"
              value="creator"
              checked={formData.role === 'creator'}
              onChange={handleChange}
              className={styles.radio}
            />
            Kreator kurseva
          </label>
        </div>

        <button type="submit" className={styles.button}>
          Registruj se
        </button>
      </form>
    </div>
  );
};

export default Register;
