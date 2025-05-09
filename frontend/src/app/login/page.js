'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(null); // Za prikaz greške

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Poziv backendu za prijavu
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
        // Ako je uspešno, sačuvaj JWT token u lokalnoj memoriji
        localStorage.setItem('auth_token', data.access_token);
        console.log('Uspješan login, token je sačuvan.');
        // Ovdje možeš redirektovati korisnika na zaštićenu rutu, npr. dashboard
        window.location.href = 'login/dashboard'; // Možeš promeniti rutu u skladu sa tvojim aplikacijama
      }
    } catch (error) {
      setErrorMessage(error.message);  // Postavi grešku ako nije uspelo
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

        {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Prikaz greške */}

        <button type="submit" className={styles.button}>
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Login;
