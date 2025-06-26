"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Container,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Paper
} from "@mui/material";
import {
  ShoppingCart, Delete, CreditCard, School
} from "@mui/icons-material";
import axios from "axios";
import styles from "./Cart.module.css";

const normalizePath = (path) => {
  if (!path) return "/placeholder.svg";
  let fixed = path.replace(/\\/g, '/');
  if (fixed.startsWith('http://') || fixed.startsWith('https://')) return fixed;
  if (!fixed.startsWith('/')) fixed = '/' + fixed;
  return `http://localhost:8000${fixed}`;
};

export default function CartPage() {
  const [cartCourses, setCartCourses] = useState([]);
  const [purchaseDialog, setPurchaseDialog] = useState({ open: false, course: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [missingCredits, setMissingCredits] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get("http://localhost:8000/user/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCourses(res.data);
    } catch (err) {
      console.error("Greška pri fetchanju korpe:", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`http://localhost:8000/user/cart-delete/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Kurs je uklonjen iz korpe", severity: "info" });
      fetchCart(); // osvježi listu
    } catch (err) {
      console.error("Greška pri brisanju iz korpe:", err);
      setSnackbar({ open: true, message: "Greška pri uklanjanju kursa", severity: "error" });
    }
  };

  const handleBuyCourse = (course) => {
    setPurchaseDialog({ open: true, course });
  };

  const confirmPurchase = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post(`http://localhost:8000/user/purchase/${purchaseDialog.course.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: `Uspješno ste kupili \"${purchaseDialog.course.title}\"!`, severity: "success" });
      fetchCart(); // ponovo učitaj korpu
    } catch (err) {
      const detail = err.response?.data?.detail?.toLowerCase() || "";
      if (detail.includes("nedovoljno kredita")) {
        const match = detail.match(/nedostaje\s+(\d+)/i);
        setMissingCredits(match ? parseInt(match[1]) : 0);
        setSnackbar({ open: true, message: `Nedovoljno kredita! Nedostaje ${missingCredits} KM`, severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Greška pri kupovini!", severity: "error" });
      }
    } finally {
      setPurchaseDialog({ open: false, course: null });
    }
  };

  const getCategoryColor = (category) => ({
    Programming: "#8b5cf6",
    Design: "#ec4899",
    Marketing: "#f59e0b",
    Business: "#10b981",
  }[category] || "#6b7280");

  const getLevelColor = (level) => ({
    Početnik: "#10b981",
    Srednji: "#f59e0b",
    Napredni: "#ef4444",
  }[level] || "#6b7280");

  const totalOriginalPrice = cartCourses.reduce((acc, c) => acc + c.price, 0);
  const totalDiscountPrice = cartCourses.reduce((acc, c) => acc + (c.price * (1 - (c.discount_percent || 0) / 100)), 0);
  const totalSavings = totalOriginalPrice - totalDiscountPrice;

  return (
    <Box className={styles.ccartContainer}>
      <Box className={styles.ccartHeader}>
        <Container maxWidth="xl">
          <Box className={styles.cheaderContent}>
            <Box className={styles.cheaderLeft}>
              <Typography variant="h3" className={styles.ccartTitle}>
                <ShoppingCart className={styles.ccartIcon} />
                Moja Korpa
              </Typography>
              <Typography variant="h6" className={styles.ccartDescription}>
                {cartCourses.length > 0
                  ? `${cartCourses.length} kurs${cartCourses.length === 1 ? "" : "eva"} u korpi`
                  : "Vaša korpa je prazna"}
              </Typography>
            </Box>

            <Paper className={styles.statsCard}>
              <Typography variant="h6" className={styles.statsTitle}>
                Ukupno
              </Typography>
              <Typography variant="h4" className={styles.totalPrice}>
                {totalDiscountPrice.toFixed(2)} KM
              </Typography>
              {totalSavings > 0 && (
                <>
                  <Typography variant="body2" className={styles.originalPrice}>
                    <span className={styles.strikethrough}>{totalOriginalPrice.toFixed(2)} KM</span>
                  </Typography>
                  <Typography variant="body2" className={styles.savings}>
                    Ušteda: {totalSavings.toFixed(2)} KM
                  </Typography>
                </>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {cartCourses.length > 0 ? (
          <div className={styles.ccardGrid}>
            {cartCourses.map((course) => (
              <div className={styles.ccardWrapper} key={course.id}>
                <Card className={styles.ccourseCard}>
                  <Box className={styles.cimageContainer}>
                    <CardMedia
                      component="img"
                      image={normalizePath(course.image_thumbnail)}
                      alt={course.title}
                      className={styles.cfixedImage}
                    />
                    <Box className={styles.cimageOverlay}>
                      {course.discount_percent > 0 && (
                        <Chip label={`-${course.discount_percent}%`} className={styles.cdiscountChip} size="small" />
                      )}
                      <IconButton onClick={() => handleRemoveFromCart(course.cart_id)} className={styles.cremoveButton}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" mt={1}>{course.title}</Typography>
                    <Typography variant="body2" mb={1}>
                      <School fontSize="small" /> {course.name} {course.surname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                    <Box mt={2}>
                      <Typography variant="h5">
                        {(course.price * (1 - (course.discount_percent || 0) / 100)).toFixed(2)} KM
                      </Typography>
                      {course.discount_percent > 0 && (
                        <Typography variant="body2" className={styles.cstrikethrough}>
                          {course.price.toFixed(2)} KM
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => handleBuyCourse(course)} variant="contained" fullWidth startIcon={<CreditCard />}>
                      Kupi sada
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="h5" align="center">Vaša korpa je prazna</Typography>
        )}
      </Container>

      <Dialog open={purchaseDialog.open} onClose={() => setPurchaseDialog({ open: false, course: null })}>
        <DialogTitle>Potvrdi kupovinu</DialogTitle>
        <DialogContent>
          <Typography>{purchaseDialog.course?.title}</Typography>
          <Typography>
            Cijena: {(purchaseDialog.course?.price * (1 - (purchaseDialog.course?.discount_percent || 0) / 100)).toFixed(2)} KM
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialog({ open: false, course: null })}>Odustani</Button>
          <Button onClick={confirmPurchase} variant="contained">Potvrdi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
