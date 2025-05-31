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

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!userData) return <div>Učitavanje profila...</div>;

  // Normalizuj putanju slike (zamena '\' sa '/')
  const normalizedImagePath = userData.profile_image
    ? userData.profile_image.replace(/\\/g, "/")
    : null;

  return (
    <Card className={styles.card} sx={{ maxWidth: 360, m: 2 }}>
      <CardHeader
        avatar={<UserIcon color="primary" className={styles.titleIcon} />}
        title={<Typography variant="h6" className={styles.cardTitle}>My Profile</Typography>}
        className={styles.cardHeader}
      />

      <CardContent className={styles.cardContent}>
        <Stack alignItems="center" spacing={1} mb={2}>
          <Avatar
            src={normalizedImagePath ? `http://localhost:8000/${normalizedImagePath}` : ""}
            alt="Profile"
            className={styles.avatar}
          >
            {!normalizedImagePath && (
              <Typography className={styles.avatarFallback}>
                {getInitials(userData.name)}
              </Typography>
            )}
          </Avatar>
          <Typography className={styles.userName}>{userData.name} {userData.surname}</Typography> {/* Prikazujemo ime i prezime */}
          <Typography className={styles.userRole}>@{userData.username}</Typography> {/* Prikazujemo nickname (username) */}
        </Stack>

        <Box className={styles.statsGrid}>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>7</Typography>
            <Typography className={styles.statLabel}>Courses</Typography>
          </Box>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>12</Typography>
            <Typography className={styles.statLabel}>Certificates</Typography>
          </Box>
          <Box className={styles.statItem}>
            <Typography className={styles.statValue}>86h</Typography>
            <Typography className={styles.statLabel}>Learning</Typography>
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
          <span className={styles.editButtonLink}>Edit Profile</span>
        </Button>
      </CardActions>
    </Card>
  );
}
