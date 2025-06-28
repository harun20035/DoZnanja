"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { Button, Typography, Rating } from "@mui/material";
import { CheckCircle, XCircle } from 'lucide-react';
import CourseReviews from "./CourseReviews";
import "./page.css";

export default function CourseInfo({ course }) {
  const [activeTab, setActiveTab] = useState("description");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(true);

  const imageUrl = course.image_thumbnail
    ? course.image_thumbnail.startsWith("http")
      ? course.image_thumbnail
      : `http://localhost:8000/${course.image_thumbnail.replace(/\\/g, "/")}`
    : "/placeholder.svg?height=450&width=800";

  const videoUrl = course.video_demo
    ? course.video_demo.startsWith("http")
      ? course.video_demo
      : `http://localhost:8000/${course.video_demo.replace(/\\/g, "/")}`
    : null;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setModalMessage("Niste prijavljeni!");
      setModalSuccess(false);
      setOpenModal(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user/add-to-cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setModalMessage(data.message || "Kurs uspješno dodan u korpu!");
        setModalSuccess(true);
      } else {
        setModalMessage(data.detail || "Greška pri dodavanju kursa.");
        setModalSuccess(false);
      }
      setOpenModal(true);
    } catch (error) {
      console.error("Greška:", error);
      setModalMessage("Greška pri dodavanju kursa u korpu.");
      setModalSuccess(false);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="course-content-section">
      <div className="container">
        <div className="row">
          {/* === Glavni sadržaj === */}
          <div className="col-lg-8 course-main-content">
            {/* === Video ili Slika === */}
            {videoUrl ? (
              <div className="video-container mb-4">
                <iframe src={videoUrl} title={course.title} allowFullScreen></iframe>
              </div>
            ) : (
              <div className="mb-4">
                <Image
                  src={imageUrl}
                  alt={course.title}
                  width={800}
                  height={450}
                  className="course-image"
                />
              </div>
            )}

            {/* === Taba "Opis" === */}
            <div className="course-tabs">
              <ul className="nav nav-tabs" id="courseTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                    type="button"
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Opis
                  </button>
                </li>
              </ul>

              <div className="tab-content pt-4">
                {activeTab === "description" && (
                  <>
                    {/* === Opis kursa === */}
                    <Typography variant="h5" className="mb-3">Opis kursa</Typography>
                    <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                      {course.description || "Ovaj kurs trenutno nema opisa."}
                    </Typography>

                    {/* === Ocjene i komentari === */}
                    <CourseReviews courseId={course.id} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* === Sidebar sa cijenom === */}
          <div className="col-lg-4 course-sidebar">
            <div className="course-price-card">
              <div className="course-price-header">
                {course.discount_percent > 0 ? (
                  <>
                    <p className="course-original-price">{course.price.toFixed(2)} Tokena</p>
                    <p className="course-price">
                      {(course.price * (1 - course.discount_percent / 100)).toFixed(2)} Tokena
                      <span className="course-discount"> -{course.discount_percent}%</span>
                    </p>
                  </>
                ) : (
                  <p className="course-price">{course.price.toFixed(2)} Tokena</p>
                )}
              </div>
              <div className="course-price-body">
                <ul className="course-features">
                  <li><i className="bi bi-play-circle-fill"></i> Pristup svim lekcijama</li>
                  <li><i className="bi bi-file-earmark-text-fill"></i> Materijali za učenje</li>
                  <li><i className="bi bi-award-fill"></i> Certifikat</li>
                  <li><i className="bi bi-infinity"></i> Doživotni pristup</li>
                  <li><i className="bi bi-phone-fill"></i> Pristup na svim uređajima</li>
                </ul>
                <button className="btn-purple w-100 mb-3" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus me-2"></i>
                  Dodaj u korpu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Modal === */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition >
        <Fade in={openModal}>
          <Box className={`modal-content ${openModal ? 'open' : ''} ${modalSuccess ? 'success' : 'error'}`}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {modalSuccess ? (
                <CheckCircle color="green" size={32} />
              ) : (
                <XCircle color="red" size={32} />
              )}
              <Typography variant="h6">{modalMessage}</Typography>
            </Box>
            <Button onClick={handleCloseModal} variant="contained">Zatvori</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
