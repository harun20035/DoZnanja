'use client';

import React, { useState } from 'react';
import { User, Mail, Key, AtSign, Save, Eye, EyeOff } from 'lucide-react';
import './profile.css';

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    nickname: 'JohnDev',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile data submitted:', formData);
    // Here you would normally send data to backend
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password change submitted');
    // Here you would normally send password change to backend
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">EduCreator</div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Edit Profile</h1>
          <div className="role-badge">ROLE: Instructor</div>
        </div>
        
        <div className="profile-container">
          <div className="avatar-container">
            <div className="avatar">
              <div className="avatar-placeholder">JD</div>
              <div className="avatar-overlay">
                <p>Change Photo</p>
              </div>
            </div>
          </div>

          <div className="tabs">
            <div className="tabs-list">
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button 
                className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'profile' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Personal Information</h2>
                    <p className="card-description">
                      Update your personal details here. These details will be displayed on your public profile.
                    </p>
                  </div>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="card-content">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <div className="input-with-icon">
                            <User className="input-icon" />
                            <input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <div className="input-with-icon">
                            <User className="input-icon" />
                            <input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="nickname">Nickname</label>
                        <div className="input-with-icon">
                          <AtSign className="input-icon" />
                          <input
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                          />
                        </div>
                        <p className="input-help">This will be displayed publicly on your profile</p>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                          <Mail className="input-icon" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <button type="button" className="button-secondary">Cancel</button>
                      <button type="submit" className="button-primary">
                        <Save className="button-icon" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Change Password</h2>
                    <p className="card-description">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="card-content">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="input-with-icon">
                          <Key className="input-icon" />
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                          />
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-with-icon">
                          <Key className="input-icon" />
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                          />
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                        <p className="input-help">Password must be at least 8 characters long</p>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-with-icon">
                          <Key className="input-icon" />
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <button type="button" className="button-secondary">Cancel</button>
                      <button type="submit" className="button-primary">
                        <Key className="button-icon" />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;