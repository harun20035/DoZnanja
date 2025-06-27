'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronDown, ChevronUp, Plus, Edit, Trash,
  Video, Image, Save, CheckCircle
} from 'lucide-react';
import "./edit_course.css";

const CourseStepEditor = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.course_id || 1;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({ title: '', description: '' });
  const [newStepFiles, setNewStepFiles] = useState({ video_file: null, image_file: null });
  const [showAddForm, setShowAddForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  const fetchSteps = async () => {
    try {
      const response = await fetch(`http://localhost:8000/course/${courseId}`);
      if (!response.ok) throw new Error("Greška pri dohvaćanju podataka.");

      const data = await response.json();
      setCourseTitle(data[0]?.course_title || `Kurs ${courseId}`);

      const enhancedSteps = data.map(step => {
        const normalizedVideo = step.video_url ? step.video_url.replace(/\\/g, '/') : null;
        const normalizedImage = step.image_url ? step.image_url.replace(/\\/g, '/') : null;

        return {
          ...step,
          video_url: normalizedVideo ? `http://localhost:8000/${normalizedVideo}` : null,
          image_url: normalizedImage ? `http://localhost:8000/${normalizedImage}` : null,
          isExpanded: false,
          isEditing: false,
          newVideoFile: null,
          newImageFile: null,
        };
      });

      setSteps(enhancedSteps);
    } catch (err) {
      console.error("Greška:", err);
      alert("Nismo mogli dohvatiti korake.");
    }
  };

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.role === 'CREATOR' || data.role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          router.push('/unauthorized');
        }
      } catch {
        router.push('/unauthorized');
      } finally {
        setIsLoading(false);
      }
    };
    checkRole();
  }, [router]);

  useEffect(() => {
    if (courseId) fetchSteps();
  }, [courseId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const toggleExpand = (stepId) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, isExpanded: !step.isExpanded } : step
    ));
  };

  const toggleEdit = (stepId) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, isEditing: !step.isEditing } : step
    ));
  };

  const handleStepChange = (stepId, field, value) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const handleStepFileChange = (stepId, field, file) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, [field]: file } : step
    ));
  };

  const handleNewStepChange = (e) => {
    const { name, value } = e.target;
    setNewStep(prev => ({ ...prev, [name]: value }));
  };

  const addStep = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const formData = new FormData();
      formData.append("title", newStep.title);
      formData.append("description", newStep.description);
      if (newStepFiles.video_file) formData.append("video_url", newStepFiles.video_file);
      if (newStepFiles.image_file) formData.append("image_url", newStepFiles.image_file);

      const response = await fetch(`http://localhost:8000/course/${courseId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Greška pri dodavanju koraka.");

      await fetchSteps();
      setNewStep({ title: '', description: '' });
      setNewStepFiles({ video_file: null, image_file: null });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju koraka.");
    }
  };

  const deleteStep = async (stepId) => {
    const confirmed = confirm('Are you sure you want to delete this step?');
    if (!confirmed) return;

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`http://localhost:8000/course/${stepId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Neuspješno brisanje koraka.");

      setSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
    } catch (error) {
      console.error("Greška pri brisanju:", error);
      alert("Došlo je do greške pri brisanju koraka.");
    }
  };

  const saveStep = async (stepId) => {
    const token = localStorage.getItem("auth_token");
    const step = steps.find(s => s.id === stepId);

    try {
      const formData = new FormData();
      formData.append("title", step.title);
      formData.append("description", step.description);
      if (step.newVideoFile) formData.append("video_url", step.newVideoFile);
      if (step.newImageFile) formData.append("image_url", step.newImageFile);

      const response = await fetch(`http://localhost:8000/course/${stepId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Greška pri ažuriranju.");

      await fetchSteps();

      setSteps(prevSteps =>
        prevSteps.map(s =>
          s.id === stepId
            ? { ...s, newVideoFile: null, newImageFile: null, isEditing: false }
            : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Neuspješno ažuriranje koraka.");
    }
  };

  return (
    <div className="course-step-editor">
      <div className="editor-header">
        <h2>Koraci kursa: </h2>
        <button className="add-step-button" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add Step'}
        </button>
      </div>

      {showAddForm && (
        <div className="step-form-container">
          <form onSubmit={addStep} className="step-form">
            <h3>Dodaj</h3>

            <div className="form-group">
              <label htmlFor="title">Step Title</label>
              <input id="title" name="title" value={newStep.title} onChange={handleNewStepChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={newStep.description} onChange={handleNewStepChange} rows={4} required />
            </div>

            <div className="form-row">
              <div className="form-group file-upload-group">
                <label>Upload Video (optional)</label>
                <label htmlFor="video_file" className="upload-icon-button">
                  <Video size={32} />
                </label>
                <input type="file" id="video_file" accept="video/*" onChange={e => setNewStepFiles(prev => ({ ...prev, video_file: e.target.files[0] }))} style={{ display: 'none' }} />
                {newStepFiles.video_file && <div className="file-added-indicator"><CheckCircle size={20} color="green" /><span>Dodani video</span></div>}
              </div>

              <div className="form-group file-upload-group">
                <label>Upload Image (optional)</label>
                <label htmlFor="image_file" className="upload-icon-button">
                  <Image size={32} />
                </label>
                <input type="file" id="image_file" accept="image/*" onChange={e => setNewStepFiles(prev => ({ ...prev, image_file: e.target.files[0] }))} style={{ display: 'none' }} />
                {newStepFiles.image_file && <div className="file-added-indicator"><CheckCircle size={20} color="green" /><span>Dodana slika</span></div>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="button-secondary" onClick={() => setShowAddForm(false)}>Izlaz</button>
              <button type="submit" className="button-primary"><Plus size={16} />Dodaj</button>
            </div>
          </form>
        </div>
      )}

      <div className="steps-list">
        {steps.length === 0 ? (
          <div className="no-steps">
            <p>Nema dodanih koraka, kliknite dodaj za dodavanje</p>
          </div>
        ) : (
          steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-header">
                <div className="step-number">{index + 1}</div>

                {step.isEditing ? (
                  <input value={step.title} onChange={(e) => handleStepChange(step.id, 'title', e.target.value)} className="step-title-input" />
                ) : (
                  <h3 className="step-title">{step.title}</h3>
                )}

                <div className="step-actions">
                  {step.isEditing ? (
                    <button className="action-button save" onClick={() => saveStep(step.id)}><Save size={16} /></button>
                  ) : (
                    <button className="action-button edit" onClick={() => toggleEdit(step.id)}><Edit size={16} /></button>
                  )}
                  <button className="action-button delete" onClick={() => deleteStep(step.id)}><Trash size={16} /></button>
                  <button className="action-button expand" onClick={() => toggleExpand(step.id)}>
                    {step.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {step.isExpanded && (
                <div className="step-details">
                  {step.isEditing ? (
                    <div className="step-edit-form">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={step.description} onChange={(e) => handleStepChange(step.id, 'description', e.target.value)} rows={4} />
                      </div>

                      <div className="form-row">
                        <div className="form-group file-upload-group">
                          <label>Upload New Video</label>
                          <label className="upload-icon-button">
                            <Video size={24} />
                            <input type="file" accept="video/*" onChange={e => handleStepFileChange(step.id, 'newVideoFile', e.target.files[0])} style={{ display: 'none' }} />
                          </label>
                          {step.newVideoFile && <span className="file-added-indicator">✔ Dodan novi video</span>}
                        </div>

                        <div className="form-group file-upload-group">
                          <label>Upload New Image</label>
                          <label className="upload-icon-button">
                            <Image size={24} />
                            <input type="file" accept="image/*" onChange={e => handleStepFileChange(step.id, 'newImageFile', e.target.files[0])} style={{ display: 'none' }} />
                          </label>
                          {step.newImageFile && <span className="file-added-indicator">✔ Dodana nova slika</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="step-description">
                        <p>{step.description}</p>
                      </div>

                      <div className="step-media">
                        {step.video_url && (
                          <div className="video-container">
                            <h4><Video size={16} /> Video</h4>
                            <video width="320" height="240" controls>
                              <source src={step.video_url} type="video/mp4" />
                            </video>
                          </div>
                        )}
                        {step.image_url && (
                          <div className="image-container">
                            <h4><Image size={16} /> Image</h4>
                            <img src={step.image_url} alt="Step image" className="step-image" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseStepEditor;
