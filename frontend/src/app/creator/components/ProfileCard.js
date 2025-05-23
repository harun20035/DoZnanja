"use client";

import { useEffect, useState } from "react";
import "./dashboard.css";
import Link from "next/link";

export default function ProfileCard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) return;

    fetch("http://localhost:8000/course/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju korisnika");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => console.error("Greška:", err));
  }, []);

  const getInitials = (ime, prezime) => {
    if (!ime || !prezime) return "??";
    return `${ime[0]}${prezime[0]}`.toUpperCase();
  };

  if (!userData) return <p>Učitavanje profila...</p>;

  // Normalizuj putanju slike (zamena '\' sa '/')
  const normalizedImagePath = userData.profile_image
    ? userData.profile_image.replace(/\\/g, "/")
    : null;

  return (
    <div className="card profile-card">
      <div className="card-header purple-header">
        <h3 className="card-title">
          <span className="icon">👤</span>
          My Profile
        </h3>
      </div>

      <div className="card-content profile-content">
        <div className="avatar-container">
          {normalizedImagePath ? (
            <img
              src={`http://localhost:8000/${normalizedImagePath}`}
              alt="Profile"
              className="avatar-img"
            />
          ) : (
            <div className="avatar-fallback">
              {getInitials(userData.name, userData.surname)}
            </div>
          )}
        </div>

        <h3 className="profile-name">
          {userData.name} {userData.surname}
        </h3>

        <p className="profile-role">{userData.username}</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "75%" }}></div>
        </div>
        <p className="progress-text">Profile completion: 75%</p>
      </div>

      <div className="card-footer">
        <Link href="/creator/profil" className="btn-outline-purple">
          ⚙ Edit Profile
        </Link>
      </div>
    </div>
  );
}
