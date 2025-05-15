'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import './register.css';

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, username, email, password } = formData;
    if (!firstName || !lastName || !username || !email || !password) {
      setErrorMessage('Molimo popunite sva polja.');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        let poruka = 'Greška prilikom registracije.';

        if (typeof data.detail === 'string') {
          if (data.detail.toLowerCase().includes('username')) {
            poruka = 'Korisničko ime već postoji.';
          } else if (data.detail.toLowerCase().includes('email')) {
            poruka = 'Email već postoji.';
          } else {
            poruka = data.detail;
          }
        }

        setErrorMessage(poruka);
        setShowErrorModal(true);
      } else {
        router.push('/login');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Greška prilikom slanja zahteva.');
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  return (
    <div className="form-container">
      <h2 className="form-title">Registracija</h2>
      <form onSubmit={handleSubmit} className="form-fields">
        <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Ime" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Prezime" />
        <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="Korisničko ime" />
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Lozinka" />

        <div className="radio-group">
          <label>
            <input type="radio" name="role" value="USER" checked={formData.role === 'USER'} onChange={handleChange} />
            Korisnik
          </label>
          <label>
            <input type="radio" name="role" value="CREATOR" checked={formData.role === 'CREATOR'} onChange={handleChange} />
            Kreator kurseva
          </label>
        </div>

        <button type="submit" className="submit-btn">Registruj se</button>

        <a href="http://localhost:8000/users/google/login" className="google-button">
          <FcGoogle className="google-icon" />
          Prijavi se sa Google
        </a>
      </form>

      {isLoading && (
        <div className="loading-message">
          Registracija je u toku...
        </div>
      )}

      {showErrorModal && (
        <div className="modal-popup error">
          <div className="modal-content">
            <AlertTriangle size={28} className="modal-icon error" />
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
