import Link from "next/link"
import { Person as UserIcon, Settings as SettingsIcon } from "@mui/icons-material"
import styles from "./profile-card.module.css"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material"

export function UserProfileCard() {
  const userData = {
    name: "John Doe",
    role: "Student",
    avatar: "", // prazan string za inicijale
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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
            src={userData.avatar || ""}
            alt="Profile"
            className={styles.avatar}
          >
            {!userData.avatar && (
              <Typography className={styles.avatarFallback}>
                {getInitials(userData.name)}
              </Typography>
            )}
          </Avatar>
          <Typography className={styles.userName}>{userData.name}</Typography>
          <Typography className={styles.userRole}>{userData.role}</Typography>
        </Stack>

        <Box className={styles.goalsSection}>
          <Box className={styles.goalHeader}>
            <span className={styles.goalLabel}>Learning Goals</span>
            <span className={styles.goalProgress}>3/5 completed</span>
          </Box>
          <Box position="relative" display="inline-flex" width="100%">
            <CircularProgress
              variant="determinate"
              value={60}
              size={24}
              thickness={5}
              sx={{ color: "primary.main" }}
              className={styles.progressBar}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="caption" component="div" color="text.primary">
                60%
              </Typography>
            </Box>
          </Box>
        </Box>

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
  )
}
