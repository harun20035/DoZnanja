// components/CourseReviews.js
"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button, Rating } from "@mui/material";
import { format } from "date-fns";

const REVIEWS_PER_PAGE = 5;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CourseReviews({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = async (page = 1) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/course/reviews/by-course/${courseId}?skip=${(page - 1) * REVIEWS_PER_PAGE}&limit=${REVIEWS_PER_PAGE}`
      );
      if (!res.ok) throw new Error("Greška pri učitavanju recenzija.");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews(reviewPage);
  }, [courseId, reviewPage]);

  return (
    <Box sx={{ maxWidth: 800, margin: "3rem auto 0 auto", textAlign: "center" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Ocjene i komentari</Typography>
      {reviewsLoading ? (
        <Typography>Učitavanje...</Typography>
      ) : reviews.length === 0 ? (
        <Typography>Nema ocjena i komentara za ovaj kurs.</Typography>
      ) : (
        <>
          {reviews.map((r) => (
            <Box
              key={r.id}
              sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, mb: 2, textAlign: "left" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{r.username || "Korisnik"}</Typography>
                {r.rating > 0 && (
                  <Rating value={r.rating} readOnly size="small" max={5} precision={0.5} />
                )}
                <Typography sx={{ color: "#888", fontSize: 13 }}>
                  {format(new Date(r.created_at), "dd.MM.yyyy.")}
                </Typography>
              </Box>
              {r.comment && (
                <Typography sx={{ fontSize: 15 }}>{r.comment}</Typography>
              )}
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={reviewPage === 1}
              onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            >
              Prethodna
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={reviews.length < REVIEWS_PER_PAGE}
              onClick={() => setReviewPage((p) => p + 1)}
            >
              Sljedeća
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
