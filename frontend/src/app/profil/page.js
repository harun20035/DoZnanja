'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Key, AtSign, Save, Eye, EyeOff } from 'lucide-react';
import styles from "./profile.module.css";
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../components/layoutComponents";
import Footer from "../../components/footer/Footer";

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profile_image: '', // putanja slike
    role: ''
  });

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch("http://localhost:8000/course/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju korisnika");
        return res.json();
      })
      .then(data => {
        const normalizedImagePath = data.profile_image ? data.profile_image.replace(/\\/g, '/') : null;

        setFormData({
          firstName: data.name || '',
          lastName: data.surname || '',
          nickname: data.username || '',
          email: data.email || '',
          profile_image: normalizedImagePath || '',
          role: data.role || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        if (normalizedImagePath) {
          setPreviewImage(`http://localhost:8000/${normalizedImagePath}`);
        } else {
          setPreviewImage(null);
        }
      })
      .catch(err => console.error("Greška:", err));
  }, []);

  useEffect(() => {
      const checkAuthorization = () => {
        try {
          const role = getRoleFromToken();
          setRole(role);
          const user = getUserDataFromToken();
          setUsername(user?.username || '');
          
          // Ako korisnik ima bilo koju rolu, smatramo ga autoriziranim
          if (role) {
            setIsAuthorized(true);
            // Dodatna logika ako je potrebno
          } else {
            router.push("/login"); // Preusmjeri na login ako nema role
          }
        } catch (error) {
          console.error("Authorization error:", error);
          router.push("/login");
        }
      };
  
      checkAuthorization();
    }, [router]);

  if (!isAuthorized) {
    return null; // Ili neki loading spinner
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Niste prijavljeni!");
      return;
    }

    const formPayload = new FormData();
    formPayload.append('profile_image', file);

    try {
      const response = await fetch("http://localhost:8000/course/change-photo", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Greška pri uploadu slike:", errorData);
        alert("Greška pri uploadu slike!");

        // Vrati preview na staru sliku jer upload nije uspeo
        if (formData.profile_image) {
          setPreviewImage(`http://localhost:8000/${formData.profile_image}`);
        } else {
          setPreviewImage(null);
        }
        return;
      }

      const data = await response.json();
      const normalizedImagePath = data.profile_image ? data.profile_image.replace(/\\/g, '/') : null;

      alert("Slika uspešno promenjena!");

      setFormData(prev => ({
        ...prev,
        profile_image: normalizedImagePath || '',
      }));

      if (normalizedImagePath) {
        setPreviewImage(`http://localhost:8000/${normalizedImagePath}`);
      }

    } catch (err) {
      console.error("Greška:", err);
      alert("Došlo je do greške prilikom upload-a slike!");
      if (formData.profile_image) {
        setPreviewImage(`http://localhost:8000/${formData.profile_image}`);
      } else {
        setPreviewImage(null);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Niste prijavljeni!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/course/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          username: formData.nickname,
          email: formData.email,
          // profile_image se ne šalje ovde
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Greška pri ažuriranju:", errorData);
        alert("Greška pri ažuriranju profila!");
        return;
      }

      const updatedData = await response.json();

      alert("Profil uspešno ažuriran!");

      setFormData(prev => ({
        ...prev,
        firstName: updatedData.name || prev.firstName,
        lastName: updatedData.surname || prev.lastName,
        nickname: updatedData.username || prev.nickname,
        email: updatedData.email || prev.email,
      }));

    } catch (err) {
      console.error("Greška:", err);
      alert("Došlo je do greške!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Niste prijavljeni!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Nova lozinka i potvrda se ne podudaraju!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/course/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Greška pri promjeni lozinke:", errorData);
        alert("Greška pri promeni lozinke!");
        return;
      }

      alert("Lozinka uspešno promenjena!");

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error("Greška:", err);
      alert("Došlo je do greške prilikom promene lozinke!");
    }
  };

  const getInitials = (first, last) => {
    if (!first || !last) return "??";
    return `${first[0]}${last[0]}`.toUpperCase();
  };

  return (
    <>
      {role && getHeaderByRole(role)}
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Edit Profile</h1>
            <div className={styles.roleBadge}>{formData.role}</div>
          </div>

          <div className={styles.profileContainer}>
            <div className={styles.avatarContainer} onClick={openFileDialog} style={{ cursor: "pointer" }}>
              <div className={styles.avatar}>
                {previewImage ? (
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile"
                    className={styles.avatarImg}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getInitials(formData.firstName, formData.lastName)}
                  </div>
                )}
                <div className={styles.avatarOverlay}>
                  <p>Promijeni sliku</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className={styles.tabs}>
            <div className={styles.tabsList}>
              <button
                className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Informacije
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Promijeni lozinku
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'profile' && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Oosbne informacije</h2>
                    <p className={styles.cardDescription}>
                      Azurirajte vase podatke ovdje koje ce biti prikazane javno.
                    </p>
                  </div>
                  <form onSubmit={handleProfileSubmit}>
                    <div className={styles.cardContent}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="firstName">Ime</label>
                          <div className={styles.inputWithIcon}>
                            <User className={styles.inputIcon} />
                            <input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className={styles.input}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="lastName">Prezime</label>
                          <div className={styles.inputWithIcon}>
                            <User className={styles.inputIcon} />
                            <input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="nickname">Korisnicko ime</label>
                        <div className={styles.inputWithIcon}>
                          <AtSign className={styles.inputIcon} />
                          <input
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            className={styles.input}
                          />
                        </div>
                        <p className={styles.inputHelp}>Ovo ce biti prikazano javno</p>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email Addresa</label>
                        <div className={styles.inputWithIcon}>
                          <Mail className={styles.inputIcon} />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button type="button" className={styles.buttonSecondary}>Izlaz</button>
                      <button type="submit" className={styles.buttonPrimary}>
                        <Save className={styles.buttonIcon} />
                        Sacuvaj promjene
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Promijeni lozinku</h2>
                    <p className={styles.cardDescription}>
                      Azurirajte vasu lozinku.
                    </p>
                  </div>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className={styles.cardContent}>
                      <div className={styles.formGroup}>
                        <label htmlFor="currentPassword">Trenutna lozinka</label>
                        <div className={styles.inputWithIcon}>
                          <Key className={styles.inputIcon} />
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className={styles.input}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="newPassword">Nova lozinka</label>
                        <div className={styles.inputWithIcon}>
                          <Key className={styles.inputIcon} />
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className={styles.input}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Potvrdi novu lozinku</label>
                        <div className={styles.inputWithIcon}>
                          <Key className={styles.inputIcon} />
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={styles.input}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button type="button" className={styles.buttonSecondary}>Izadji</button>
                      <button type="submit" className={styles.buttonPrimary}>
                        <Save className={styles.buttonIcon} />
                        Promijeni lozinku
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;