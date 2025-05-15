"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.warn("Nema tokena!");
      return;
    }

    fetch("http://localhost:8000/course/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Greška prilikom dohvaćanja korisnika");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data); // ⬅️ Spremi sve ovdje
      })
      .catch((err) => {
        console.error("Došlo je do greške:", err);
      });
  }, []);

  if (!userData) return <p>Učitavanje korisnika...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profil korisnika</h1>
      <p><strong>Ime:</strong> {userData.name}</p>
      <p><strong>Prezime:</strong> {userData.surname}</p>
      <p><strong>Korisničko ime:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Uloga:</strong> {userData.role}</p>
      <p><strong>Krediti:</strong> {userData.credits}</p>
    </div>
  );
}
