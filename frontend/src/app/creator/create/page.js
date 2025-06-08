'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Video, CheckCircle, AlertTriangle } from 'lucide-react';
import './createCourse.css';

export default function CreateCourseForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Programming');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = [];
  if (!thumbnail) errors.push('Niste unijeli sliku.');
  if (!video) errors.push('Niste unijeli video.');

  if (errors.length > 0) {
    setErrorMessage(errors.join(' '));
    setShowErrorModal(true);
    return;
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    setErrorMessage('⚠️ Nisi ulogovan ili nema tokena u localStorage-u.');
    setShowErrorModal(true);
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('discount_percent', discount);
  formData.append('category', category);
  formData.append('image_thumbnail', thumbnail);
  formData.append('video_demo', video);

  try {
    const res = await fetch('http://localhost:8000/course/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (Array.isArray(data.detail)) {
        const poruke = data.detail.map((err) => err.msg).join(', ');
        setErrorMessage(poruke);
      } else if (typeof data.detail === 'string') {
        setErrorMessage(data.detail);
      } else {
        setErrorMessage('Greška prilikom kreiranja kursa.');
      }
      setShowErrorModal(true);
    } else {
      setShowSuccessModal(true);
      // Reset polja
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscount('');
      setCategory('Programming');
      setThumbnail(null);
      setVideo(null);
    }
  } catch (err) {
    console.error(err);
    setErrorMessage('Greška prilikom slanja zahteva.');
    setShowErrorModal(true);
  }
};


  useEffect(() => {
  if (showSuccessModal) {
    const timer = setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [showSuccessModal]);


  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  return (
    <div className="form-container">
      <h2 className="form-title">Kreiraj Kurs</h2>
      <form onSubmit={handleSubmit} className="form-fields">
        <input type="text" placeholder="Naslov" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Cena" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Popust (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="Programming">Programiranje</option>
          <option value="Design">Dizajn</option>
          <option value="Marketing">Marketing</option>
          <option value="Business">Biznis</option>
          <option value="Photography">Fotografija</option>
          <option value="Music">Muzika</option>
          <option value="Other">Ostalo</option>
        </select>

        <div className="upload-wrapper">
          <label htmlFor="thumbnail-upload" className="upload-btn">
            <ImagePlus className="icon" />
            Dodaj Sliku
          </label>
          <input id="thumbnail-upload" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} hidden />
          {thumbnail && (
            <span className="upload-success">
              <CheckCircle size={16} /> Dodana slika
            </span>
          )}
        </div>

        <div className="upload-wrapper">
          <label htmlFor="video-upload" className="upload-btn">
            <Video className="icon" />
            Dodaj Video
          </label>
          <input id="video-upload" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} hidden />
          {video && (
            <span className="upload-success">
              <CheckCircle size={16} /> Dodan video
            </span>
          )}
        </div>

        <button type="submit" className="submit-btn">Kreiraj</button>
      </form>

      {showSuccessModal && (
        <div className="modal-popup success">
          <div className="modal-content">
            <CheckCircle size={28} className="modal-icon" />
            Kurs uspešno kreiran!
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal-popup error">
          <div className="modal-content">
            <AlertTriangle size={28} className="modal-icon error" />
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
