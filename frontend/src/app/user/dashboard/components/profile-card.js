import { useState, useEffect } from "react";
import Link from "next/link";
import { Person as UserIcon, Settings as SettingsIcon } from "@mui/icons-material";
import styles from "./profile-card.module.css";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Stack,
} from "@mui/material";

export function UserProfileCard() {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    // Fetch korisničkih podataka
    fetch("http://localhost:8000/course/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju korisnika");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => console.error("Greška:", err));

    // Fetch korisničkih statistika
    fetch("http://localhost:8000/user/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju statistika");
        return res.json();
      })
      .then((data) => setUserStats(data))
      .catch((err) => console.error("Greška:", err));
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!userData || !userStats) return <div>Učitavanje profila...</div>;

  const normalizedImagePath = userData.profile_image
    ? userData.profile_image.replace(/\\/g, "/")
    : null;

  return (
    <Card className={styles.card} sx={{ maxWidth: 360, m: 2 }}>
      <CardHeader
        avatar={<UserIcon color="primary" className={styles.titleIcon} />}
        title={<Typography variant="h6" className={styles.cardTitle}>Moj Profil</Typography>}
        className={styles.cardHeader}
      />

      <CardContent className={styles.cardContent}>
        <Stack alignItems="center" spacing={1} mb={2}>
          <Avatar
            src={normalizedImagePath ? `http://localhost:8000/${normalizedImagePath}` : ""}
            alt="Profil"
            className={styles.avatar}
          >
            {!normalizedImagePath && (
              <Typography className={styles.avatarFallback}>
                {getInitials(userData.name)}
              </Typography>
            )}
          </Avatar>
          <Typography className={styles.userName}>{userData.name} {userData.surname}</Typography>
          <Typography className={styles.userRole}>@{userData.username}</Typography>
        </Stack>

        <Box className={styles.statsGrid}>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>{userStats.enrolled_courses}</Typography>
            <Typography className={styles.statLabel}>Kursevi</Typography>
          </Box>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>{userStats.completed_courses}</Typography>
            <Typography className={styles.statLabel}>Završeni</Typography>
          </Box>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>{userStats.completed_steps}</Typography>
            <Typography className={styles.statLabel}>Koraci</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions className={styles.cardFooter} sx={{ justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon className={styles.editButtonIcon} />}
          component={Link}
          href="/profil"
          className={styles.editButton}
          sx={{ textTransform: "none" }}
        >
          <span className={styles.editButtonLink}>Izmijeni profil</span>
        </Button>
      </CardActions>
    </Card>
  );
}
