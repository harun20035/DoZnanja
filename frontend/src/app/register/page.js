'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',  // Dodato polje za korisničko ime
    email: '',
    password: '',
    role: 'USER',  // Promenjena vrednost na "USER"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registracija:', formData);

    try {
      const response = await fetch('http://localhost:8000/users/register', {  // Promeni URL na tvoj backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          username: formData.username,  // Dodato slanje username
          email: formData.email,
          password: formData.password,
          role: formData.role,  // Slanje uloge
        }),
      });

      if (!response.ok) {
        throw new Error('Neuspela registracija');
      }

      const data = await response.json();
      console.log('User created:', data);
      window.location.href = '/login';
    } catch (error) {
      console.error('Greška prilikom registracije:', error);
    }
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
          type="text"
          name="username"  // Dodato polje za korisničko ime
          placeholder="Korisničko ime"
          className={styles.input}
          value={formData.username}
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
              value="USER"  // Ažurirano na "USER"
              checked={formData.role === 'USER'}
              onChange={handleChange}
              className={styles.radio}
            />
            Korisnik
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="role"
              value="CREATOR"  // Ažurirano na "CREATOR"
              checked={formData.role === 'CREATOR'}
              onChange={handleChange}
              className={styles.radio}
            />
            Kreator kurseva
          </label>
        </div>

        <button type="submit" className={styles.button}>
          Registruj se
        </button>

        {/* Google login button */}
        <a href="http://localhost:8000/users/google/login" className={styles.googleButton}>
          Prijavi se sa Google
        </a>
      </form>
    </div>
  );
};

export default Register;
