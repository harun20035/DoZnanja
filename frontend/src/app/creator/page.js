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
import { UserDashboardHeader } from "../partials/header"
import { Footer } from "../partials/footer"

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        console.log("Dobijena role:", role);
        const user = getUserDataFromToken(); // Dodajte ovu funkciju u auth.js
        
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
      <UserDashboardHeader />
      <div className="dashboard-container">
        <h1 className="welcome-title">Welcome {userData.username}</h1>
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
