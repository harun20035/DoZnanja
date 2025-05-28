'use client'

import "./components/dashboard.css"
import StatsSection from "./components/StatisticsSection"
import CreateCourseCard from "./components/CreateCourseCard"
import ProfileCard from "./components/ProfileCard"
import MessagesCard from "./components/MessagesCard"
import MyCourses from "./components/MyCoursesSection"
import userData from "./components/ProfileCard"
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import getHeaderByRole from "../../components/layoutComponents"
import { Footer } from "../partials/footer"

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null); // Dodajte stanje za role

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role); // Spremite role u stanje
        console.log("Dobijena role:", role);
        const user = getUserDataFromToken();
        
        if (role === "CREATOR") {
          setUsername(user?.username || '');
          setIsAuthorized(true);
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Authorization error:", error);
      }
    };

    checkAuthorization();
  }, [router]);

  if (!isAuthorized) {
    return null; // Ili neki loading spinner
  }

  return (
    <>
      {role && getHeaderByRole(role)} {/* Dodajte provjeru da role postoji */}
      <div className="dashboard-container">
        <h1 className="welcome-title">Welcome {username}</h1> {/* Koristite username iz stanja */}
        <div className="dashboard-grid">
          <CreateCourseCard />
          <ProfileCard />
          <MessagesCard />
        </div>
        <StatsSection />
        <MyCourses />
      </div>
      <Footer />
    </>
  )
}