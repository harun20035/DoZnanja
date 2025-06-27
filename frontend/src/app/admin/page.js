"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { getRoleFromToken } from "@/utils/auth"

import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  Container,
  Collapse,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettings,
  ExpandMore,
  ExpandLess,
  Check,
  Close,
  PlayCircleOutline,
  Image,
  Category,
  CalendarToday,
} from "@mui/icons-material";
import styles from "./Admin.module.css";

const normalizeImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  let fixedPath = path.replace(/\\/g, "/");
  if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://")) {
    return fixedPath;
  }
  if (!fixedPath.startsWith("/")) {
    fixedPath = "/" + fixedPath;
  }
  return `http://localhost:8000${fixedPath}`;
};

export default function AdminPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, course: null, action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


  useEffect(() => {
    const role = getRoleFromToken();
    if (role !== "ADMIN") {
      router.push("/unauthorized");
      return;
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/pregled-svega");
        const { users, courses, course_steps } = res.data;

        const mappedCourses = courses.map((course) => {
          const creator = users.find((u) => u.id === course.creator_id);

          return {
            ...course,
            image_thumbnail: normalizeImageUrl(course.image_thumbnail),
            video_demo: normalizeImageUrl(course.video_demo),
            creator: {
              ...creator,
              profile_image: normalizeImageUrl(creator?.profile_image),
            },
            steps: course_steps
              .filter((step) => step.course_id === course.id)
              .map((step) => ({
                ...step,
                video_url: normalizeImageUrl(step.video_url),
                image_url: normalizeImageUrl(step.image_url),
              })),
          };
        });

        setCourses(mappedCourses);
      } catch (error) {
        console.error("Greška prilikom dohvatanja admin podataka:", error);
      }
    };

    fetchData();
  }, []);

  

  const handleCourseToggle = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedStep(null);
  };

  const handleStepToggle = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const confirmAction = async () => {
  const { course, action } = confirmDialog;
  try {
    await axios.put(`http://localhost:8000/admin/course-status/${course.id}`, {
      new_status: action === "accept" ? "APPROVED" : "REJECTED",
    });

    const updatedCourses = courses.map((c) =>
      c.id === course.id ? { ...c, status: action === "accept" ? "APPROVED" : "REJECTED" } : c,
    );
    setCourses(updatedCourses);

    setSnackbar({
      open: true,
      message: `Kurs \"${course.title}\" je ${action === "accept" ? "odobren" : "odbačen"}`,
      severity: action === "accept" ? "success" : "warning",
    });
  } catch (error) {
    console.error("Greška prilikom promjene statusa:", error);
    setSnackbar({
      open: true,
      message: "Greška prilikom promjene statusa kursa",
      severity: "error",
    });
  } finally {
    setConfirmDialog({ open: false, course: null, action: null });
  }
};


  const handleCourseAction = (course, action) => {
    setConfirmDialog({ open: true, course, action });
  };

  

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "APPROVED":
        return "#10b981";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Na čekanju";
      case "APPROVED":
        return "Odobren";
      case "REJECTED":
        return "Odbačen";
      default:
        return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "PROGRAMMING":
        return "Programiranje";
      case "DESIGN":
        return "Dizajn";
      case "MARKETING":
        return "Marketing";
      case "MUSIC":
        return "Muzika";
      case "BUSINESS":
        return "Biznis";
      case "PHOTOGRAPHY":
        return "Fotografija";
      case "LANGUAGES":
        return "Jezici";
      case "OTHER":
        return "Ostalo";
      default:
        return category;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  

  return (
    <Box className={styles.adminContainer}>
      <Box className={styles.adminHeader}>
        <Container maxWidth="xl">
          <Typography variant="h3" className={styles.adminTitle}>
            <AdminPanelSettings className={styles.adminIcon} />
            Admin Panel
          </Typography>
          <Typography variant="h6" className={styles.adminDescription}>
            Upravljanje kursevima i odobravanje sadržaja
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" className={styles.mainContent}>
        <Paper className={styles.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeader}>
                  <TableCell className={styles.headerCell}>Kurs</TableCell>
                  <TableCell className={styles.headerCell}>Kreator</TableCell>
                  <TableCell className={styles.headerCell}>Kategorija</TableCell>
                  <TableCell className={styles.headerCell}>Status</TableCell>
                  <TableCell className={styles.headerCell}>Datum</TableCell>
                  <TableCell className={styles.headerCell}>Akcije</TableCell>
                  <TableCell className={styles.headerCell}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {courses.map((course) => (
    <React.Fragment key={course.id}>
      <TableRow className={styles.courseRow}>
        <TableCell className={styles.courseCell}>
          <Box className={styles.courseInfo}>
            <Avatar
              src={course.image_thumbnail}
              alt={course.title}
              variant="rounded"
              className={styles.courseImage}
            />
            <Box>
              <Typography variant="h6" className={styles.courseTitle}>
                {course.title}
              </Typography>
              <Typography variant="body2" className={styles.courseDescription}>
                {course.description}
              </Typography>
              <Typography variant="body2" className={styles.coursePrice}>
                {course.price.toFixed(2)} KM
                {course.discount_percent > 0 && (
                  <Chip
                    label={`-${course.discount_percent}%`}
                    size="small"
                    className={styles.discountChip}
                  />
                )}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Box className={styles.creatorInfo}>
            <Avatar src={course.creator.profile_image} className={styles.creatorAvatar} />
            <Box>
              <Typography variant="body2" className={styles.creatorName}>
                {course.creator.name} {course.creator.surname}
              </Typography>
              <Typography variant="caption" className={styles.creatorUsername}>
                @{course.creator.username}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Chip
            label={getCategoryText(course.category)}
            className={styles.categoryChip}
            icon={<Category />}
          />
        </TableCell>

        <TableCell>
          <Chip
            label={getStatusText(course.status)}
            sx={{ backgroundColor: getStatusColor(course.status), color: "white" }}
          />
        </TableCell>

        <TableCell>
          <Box className={styles.dateInfo}>
            <CalendarToday className={styles.dateIcon} />
            <Typography variant="body2">{formatDate(course.created_at)}</Typography>
          </Box>
        </TableCell>

        <TableCell>
          {course.status === "PENDING" && (
            <Box className={styles.actionButtons}>
              <Button
                onClick={() => handleCourseAction(course, "accept")}
                className={styles.acceptButton}
                size="small"
                startIcon={<Check />}
              >
                Odobri
              </Button>
              <Button
                onClick={() => handleCourseAction(course, "reject")}
                className={styles.rejectButton}
                size="small"
                startIcon={<Close />}
              >
                Odbaci
              </Button>
            </Box>
          )}
        </TableCell>

        <TableCell>
          <IconButton onClick={() => handleCourseToggle(course.id)} className={styles.expandButton}>
            {expandedCourse === course.id ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} className={styles.collapseCell}>
          <Collapse in={expandedCourse === course.id} timeout="auto" unmountOnExit>
            <Box className={styles.stepsContainer}>
              <Typography variant="h6" className={styles.stepsTitle}>
                Lekcije kursa ({course.steps.length})
              </Typography>

              {course.steps.map((step) => (
                <Card key={step.id} className={styles.stepCard}>
                  <Box className={styles.stepHeader} onClick={() => handleStepToggle(step.id)}>
                    <Box className={styles.stepInfo}>
                      <Typography variant="h6" className={styles.stepTitle}>
                        {step.title}
                      </Typography>
                      <Box className={styles.stepMeta}>
                        {step.video_url && (
                          <Chip
                            icon={<PlayCircleOutline />}
                            label="Video"
                            size="small"
                            className={styles.videoChip}
                          />
                        )}
                        {step.image_url && (
                          <Chip
                            icon={<Image />}
                            label="Slika"
                            size="small"
                            className={styles.imageChip}
                          />
                        )}
                      </Box>
                    </Box>
                    <IconButton className={styles.stepExpandButton}>
                      {expandedStep === step.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedStep === step.id} timeout="auto" unmountOnExit>
                    <CardContent className={styles.stepContent}>
                      <Typography variant="body1" className={styles.stepDescription}>
                        {step.description}
                      </Typography>

                      {step.video_url && (
                        <Box className={styles.stepVideo}>
                          <Typography variant="h6" className={styles.mediaTitle}>
                            📹 Video sadržaj
                          </Typography>
                          <Box className={styles.videoWrapper}>
                            <iframe
                              src={step.video_url}
                              title={step.title}
                              frameBorder="0"
                              allowFullScreen
                              className={styles.videoFrame}
                            />
                          </Box>
                        </Box>
                      )}

                      {step.image_url && (
                        <Box className={styles.stepImage}>
                          <Typography variant="h6" className={styles.mediaTitle}>
                            🖼️ Slika/Dijagram
                          </Typography>
                          <img
                            src={step.image_url}
                            alt={step.title}
                            className={styles.stepImageContent}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  ))}
</TableBody>

            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, course: null, action: null })}>
        <DialogTitle className={styles.dialogTitle}>
          {confirmDialog.action === "accept" ? (
            <>
              <Check className={styles.dialogIcon} />
              Odobri kurs
            </>
          ) : (
            <>
              <Close className={styles.dialogIcon} />
              Odbaci kurs
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite {confirmDialog.action === "accept" ? "odobriti" : "odbaciti"} kurs "
            {confirmDialog.course?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setConfirmDialog({ open: false, course: null, action: null })}>Odustani</Button>
          <Button
            onClick={confirmAction}
            className={
              confirmDialog.action === "accept" ? styles.confirmAcceptButton : styles.confirmRejectButton
            }
            variant="contained"
          >
            {confirmDialog.action === "accept" ? "Odobri" : "Odbaci"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          className={styles.snackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
