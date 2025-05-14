'use client';

import { useState } from 'react';

export default function CreateCourseForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Programming');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setMessage('⚠️ Nisi ulogovan ili nema tokena u localStorage-u.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount_percent', discount);
    formData.append('category', category);
    if (thumbnail) formData.append('image_thumbnail', thumbnail);
    if (video) formData.append('video_demo', video);

    try {
      const res = await fetch('http://localhost:8000/course/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('❌ Greška: ' + (data.detail || JSON.stringify(data)));
      } else {
        setMessage('✅ Kurs uspešno kreiran!');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Greška prilikom slanja zahteva.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Kreiraj Kurs</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Naslov"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Cena"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Popust (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Dropdown za kategoriju */}
        <div>
          <label className="block mb-1">Kategorija:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business</option>
            <option value="Photography">Photography</option>
            <option value="Music">Music</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Thumbnail:</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="block mb-1">Demo Video:</label>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kreiraj
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
