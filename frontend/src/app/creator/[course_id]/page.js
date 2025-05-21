'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Plus, Edit, Trash, Video, Image, Save, CheckCircle } from 'lucide-react';
import "./edit_course.css"

const CourseStepEditor = () => {
  const params = useParams();
  const courseId = params.course_id || 1;

  useEffect(() => {
    console.log("COURSE ID iz URL-a:", courseId);
  }, [courseId]);

  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
  });
  const [newStepFiles, setNewStepFiles] = useState({
    video_file: null,
    image_file: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);

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

      if (newStepFiles.video_file) {
        formData.append("video_url", newStepFiles.video_file);
      }
      if (newStepFiles.image_file) {
        formData.append("image_url", newStepFiles.image_file);
      }

      const response = await fetch(`http://localhost:8000/course/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // NE STAVLJAJ Content-Type!
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Greška pri dodavanju koraka.");

      const data = await response.json();
      setSteps([...steps, {
        ...data,
        isExpanded: false,
        isEditing: false
      }]);

      setNewStep({
        title: '',
        description: '',
      });
      setNewStepFiles({
        video_file: null,
        image_file: null,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju koraka.");
    }
  };

  const deleteStep = (stepId) => {
    if (confirm('Are you sure you want to delete this step?')) {
      setSteps(steps.filter(step => step.id !== stepId));
    }
  };

  const saveStep = (stepId) => {
    toggleEdit(stepId);
    console.log('Saved step:', steps.find(step => step.id === stepId));
  };

  return (
    <div className="course-step-editor">
      <div className="editor-header">
        <h2>Course Steps for Course ID: {courseId}</h2>
        <button 
          className="add-step-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Add Step'}
        </button>
      </div>

      {showAddForm && (
        <div className="step-form-container">
          <form onSubmit={addStep} className="step-form">
            <h3>Add New Step</h3>
            
            <div className="form-group">
              <label htmlFor="title">Step Title</label>
              <input
                id="title"
                name="title"
                value={newStep.title}
                onChange={handleNewStepChange}
                placeholder="Enter step title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newStep.description}
                onChange={handleNewStepChange}
                placeholder="Enter step description"
                rows={4}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group file-upload-group">
                <label>Upload Video (optional)</label>
                <label htmlFor="video_file" className="upload-icon-button" title="Dodaj video">
                  <Video size={32} />
                </label>
                <input
                  type="file"
                  id="video_file"
                  accept="video/*"
                  onChange={e => setNewStepFiles(prev => ({ ...prev, video_file: e.target.files[0] }))}
                  style={{ display: 'none' }}
                />
                {newStepFiles.video_file && (
                  <div className="file-added-indicator">
                    <CheckCircle size={20} color="green" />
                    <span>Dodani video</span>
                  </div>
                )}
              </div>
              
              <div className="form-group file-upload-group">
                <label>Upload Image (optional)</label>
                <label htmlFor="image_file" className="upload-icon-button" title="Dodaj sliku">
                  <Image size={32} />
                </label>
                <input
                  type="file"
                  id="image_file"
                  accept="image/*"
                  onChange={e => setNewStepFiles(prev => ({ ...prev, image_file: e.target.files[0] }))}
                  style={{ display: 'none' }}
                />
                {newStepFiles.image_file && (
                  <div className="file-added-indicator">
                    <CheckCircle size={20} color="green" />
                    <span>Dodana slika</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="button-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="button-primary">
                <Plus size={16} className="button-icon" />
                Add Step
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="steps-list">
        {steps.length === 0 ? (
          <div className="no-steps">
            <p>No steps added yet. Click "Add Step" to create your first course step.</p>
          </div>
        ) : (
          steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-header">
                <div className="step-number">{index + 1}</div>
                
                {step.isEditing ? (
                  <input
                    value={step.title}
                    onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                    className="step-title-input"
                  />
                ) : (
                  <h3 className="step-title">{step.title}</h3>
                )}
                
                <div className="step-actions">
                  {step.isEditing ? (
                    <button 
                      className="action-button save"
                      onClick={() => saveStep(step.id)}
                    >
                      <Save size={16} />
                    </button>
                  ) : (
                    <button 
                      className="action-button edit"
                      onClick={() => toggleEdit(step.id)}
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  
                  <button 
                    className="action-button delete"
                    onClick={() => deleteStep(step.id)}
                  >
                    <Trash size={16} />
                  </button>
                  
                  <button 
                    className="action-button expand"
                    onClick={() => toggleExpand(step.id)}
                  >
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
                        <textarea
                          value={step.description}
                          onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Video URL</label>
                          <div className="input-with-icon">
                            <Video className="input-icon" size={16} />
                            <input
                              value={step.video_url || ''}
                              onChange={(e) => handleStepChange(step.id, 'video_url', e.target.value)}
                              placeholder="https://example.com/video.mp4"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Image URL</label>
                          <div className="input-with-icon">
                            <Image className="input-icon" size={16} />
                            <input
                              value={step.image_url || ''}
                              onChange={(e) => handleStepChange(step.id, 'image_url', e.target.value)}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
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
                            <div className="video-placeholder">
                              <video width="320" height="240" controls>
                                <source src={step.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        )}
                        {step.image_url && (
                          <div className="image-container">
                            <h4><Image size={16} /> Image</h4>
                            <img src={step.image_url} alt="Step related" className="step-image" />
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
