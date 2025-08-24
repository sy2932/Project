import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";
const dotheRightThing = process.env.PUBLIC_URL + "/DoTheGoodThing.svg";
const neverSettle = process.env.PUBLIC_URL + "/NeverSettle.svg";
const betterTogether = process.env.PUBLIC_URL + "/BetterTogether.svg";
const profileIcon = process.env.PUBLIC_URL + "/logo.svg";
const scbLogo =
  "https://upload.wikimedia.org/wikipedia/commons/7/7e/Standard_Chartered_Logo_%282021%2C_Logo_only%29.svg";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [contactInfo, setContactInfo] = useState({
    email: "admin@sc.com",
    phone: "9876543212",
  });

  const [profileImage, setProfileImage] = useState(
    "https://s3.ca-central-1.amazonaws.com/subphoto-photos/2018-10-25_16-41-21/large_069d54b87_2018_Besney_Jonathan-9837.jpg"
  );

  const employeeData = {
    name: "Ramanujan",
    employeeId: "2030923",

    role: "System Administrator",
    email: contactInfo.email,
    phone: contactInfo.phone,
    profileImage: profileImage,
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDownload = () => {
    const content = `Admin Profile\n\nName: ${employeeData.name}\nAdmin ID: ${employeeData.employeeId}\nRole: ${employeeData.role}\nEmail: ${employeeData.email}\nPhone: ${employeeData.phone}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-profile.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSecurity = () => setIsSecurityOpen((prev) => !prev);

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    if (passwords.new.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleContactSubmit = () => {
    alert("Contact information updated successfully!");
    setIsEditing(false);
  };

  const handleClose = () => {
    navigate("/adminDashboard");
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);

        alert("Profile image updated successfully!");
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-profile-container">
      <button
        type="button"
        className="close-btn"
        aria-label="Close"
        onClick={handleClose}
      >
        ✕
      </button>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {isEditing ? (
                  <div className="avatar-edit-container">
                    <img
                      src={profileImage || profileIcon}
                      alt="Profile"
                      className="avatar-image"
                    />
                    <div className="avatar-edit-overlay">
                      <label
                        htmlFor="profile-image-input"
                        className="avatar-edit-label"
                      >
                        <span>📷</span>
                      </label>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProfileImageChange(e)}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={profileImage || profileIcon}
                    alt="Profile"
                    className="avatar-image"
                  />
                )}
              </div>
              <div className="profile-name">
                {employeeData.name}
                <img src={scbLogo} alt="SCB Logo" className="scb-logo" />
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="details-box">
              <h3>Admin Details</h3>
              <div className="detail-item">
                <span>Admin Id: {employeeData.employeeId}</span>
              </div>
              <div className="detail-item">
                <span>Role: {employeeData.role}</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={toggleEdit}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              Download Profile
            </button>
          </div>
        </div>

        <div className="right-section">
          <div className="info-panel contact-panel">
            <div className="panel-header blue-header">
              <h3>Contact Details</h3>
            </div>
            <div className="panel-content open">
              <div className="contact-info">
                <div className="contact-item">
                  <label>Mail Id:</label>
                  <div className="contact-value">{contactInfo.email}</div>
                </div>
                <div className="contact-item">
                  <label>Phone No:</label>
                  <div className="contact-value">{contactInfo.phone}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-panel security-panel">
            <div className="panel-header green-header" onClick={toggleSecurity}>
              <h3>Security Controls</h3>
              <div className={`dropdown-arrow ${isSecurityOpen ? "open" : ""}`}>
                ▼
              </div>
            </div>
            <div
              className={`security-panel-content ${
                isSecurityOpen ? "open" : ""
              }`}
            >
              <div className="password-section">
                <h4>Password Change</h4>
                <div className="password-fields">
                  <div className="field-group">
                    <label>Current Password:</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) =>
                        handlePasswordChange("current", e.target.value)
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>New Password:</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) =>
                        handlePasswordChange("new", e.target.value)
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Re-enter New Password:</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        handlePasswordChange("confirm", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="btn btn-primary password-submit-btn"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="images-section">
            <div className="image-item">
              <div className="image-placeholder">
                <img
                  src={dotheRightThing}
                  alt="Do the right thing"
                  className="png-image"
                />
              </div>
              <div className="image-label">
                <strong>Do the right thing</strong>
              </div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">
                <img
                  src={neverSettle}
                  alt="Never settle"
                  className="png-image"
                />
              </div>
              <div className="image-label">
                <strong>Never settle</strong>
              </div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">
                <img
                  src={betterTogether}
                  alt="Better together"
                  className="png-image"
                />
              </div>
              <div className="image-label">
                <strong>Better together</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
