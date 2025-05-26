"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShoppingCartOutlined,
  NotificationsNoneOutlined,
  LogoutOutlined,
} from "@mui/icons-material"
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Typography,
} from "@mui/material"
import styles from "./header.module.css"

export function UserDashboardHeader() {
  const [cartCount, setCartCount] = useState(2) // Primer broja u korpi

  // Hardkodirani korisnički podaci
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: null, // ili "/avatar.png"
    role: "Student",
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Logout handler (još nije povezan sa backendom)
  const handleLogout = () => {
    console.log("Logout clicked")
    // ovde ide logika za logout
  }

  return (
    <header className={styles.header}>
      <Box className={styles.container}>
        <Box className={styles.headerContent}>

          {/* Logo + Desktop nav */}
          <Box className={styles.logoNav}>
            <Link href="/" passHref legacyBehavior>
              <Typography component="a" className={styles.logo} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>📚</span>
                <span className="fw-bold">DoZnanja</span>
              </Typography>
            </Link>

            <Box component="nav" className={styles.desktopNav}>
              {[
                { href: "/user", label: "Dashboard" },
                { href: "/user/courses", label: "My Courses" },
                { href: "/courses", label: "Browse Courses" },
                { href: "/user/chat", label: "Messages" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    className={styles.navLink}
                    sx={{ cursor: "pointer" }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>

          {/* User actions */}
          <Box className={styles.userActions}>
            <IconButton
              className={styles.iconButton}
              aria-label="shopping cart"
              size="large"
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                overlap="circular"
                className={styles.cartBadge}
              >
                <ShoppingCartOutlined className={styles.actionIcon} />
              </Badge>
            </IconButton>

            <IconButton
              className={styles.iconButton}
              aria-label="notifications"
              size="large"
            >
              <NotificationsNoneOutlined className={styles.actionIcon} />
            </IconButton>

            <Avatar
              src={userData.avatar || undefined}
              alt="Profile"
              className={styles.avatar}
            >
              {!userData.avatar && getInitials(userData.name)}
            </Avatar>

            {/* Log out ikonica umesto hamburgera */}
            <IconButton
              onClick={handleLogout}
              className={styles.iconButton}
              aria-label="logout"
              size="large"
            >
              <LogoutOutlined className={styles.actionIcon} />
            </IconButton>
          </Box>

        </Box>
      </Box>
    </header>
  )
}
