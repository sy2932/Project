import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeProfile.css";
const dotheRightThing = process.env.PUBLIC_URL + "/DoTheGoodThing.svg";
const neverSettle = process.env.PUBLIC_URL + "/NeverSettle.svg";
const betterTogether = process.env.PUBLIC_URL + "/BetterTogether.svg";
const profileIcon = process.env.PUBLIC_URL + "/logo.svg";
const scbLogo =
  "https://upload.wikimedia.org/wikipedia/commons/7/7e/Standard_Chartered_Logo_%282021%2C_Logo_only%29.svg";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mailId: "",
    phoneNo: "",
    employeeId: "",
    role: "",
    department: "",
  });
  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const nameLength = fullName.length;
  let nameSizeClass = "";
  if (nameLength > 30) {
    nameSizeClass = "name-xxs";
  } else if (nameLength > 24) {
    nameSizeClass = "name-xs";
  } else if (nameLength > 18) {
    nameSizeClass = "name-sm";
  } else if (nameLength > 15) {
    nameSizeClass = "name-md";
  }

  useEffect(() => {
    const loginEmail = localStorage.getItem("loginEmail") || "";
    let savedDetails = {};
    try {
      savedDetails =
        JSON.parse(
          localStorage.getItem(`employeeDetails_${loginEmail}`) || "null"
        ) || {};
    } catch {
      savedDetails = {};
    }
    const savedPhoto = localStorage.getItem(`employeePhoto_${loginEmail}`);

    setForm({
      firstName: savedDetails.firstName || "",
      lastName: savedDetails.lastName || "",
      mailId: savedDetails.mailId || loginEmail,
      phoneNo: savedDetails.phoneNo || "",
      employeeId: savedDetails.employeeId || "",
      role: savedDetails.role || "",
      department: savedDetails.department || "",
    });

    if (savedPhoto) {
      setProfileImage(savedPhoto);
    }
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleSecurity = () => {
    setIsSecurityOpen(!isSecurityOpen);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    navigate("/employeeDashboard");
  };

  const handleDownload = () => {
    const content = `Employee Profile\n\nName: ${form.firstName} ${form.lastName}\nID: ${form.employeeId}\nDepartment: ${form.department}\nRole: ${form.role}\nEmail: ${form.mailId}\nPhone: ${form.phoneNo}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-profile.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        const loginEmail = localStorage.getItem("loginEmail") || "";
        localStorage.setItem(`employeePhoto_${loginEmail}`, reader.result);
        alert("Profile image updated successfully!");
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="employee-profile-container">
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
              <div className={`profile-name ${nameSizeClass}`} title={fullName}>
                {fullName}
                <img src={scbLogo} alt="SCB Logo" className="scb-logo" />
              </div>
            </div>
          </div>
          <div className="profile-details">
            <div className="details-box">
              <h3>Details</h3>
              <div className="detail-item">
                <span>Employee Id: {form.employeeId}</span>
              </div>
              <div className="detail-item">
                <span>Department: {form.department}</span>
              </div>
              <div className="detail-item">
                <span>Role: {form.role}</span>
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
                  <div className="contact-value">{form.mailId}</div>
                </div>
                <div className="contact-item">
                  <label>Phone No:</label>
                  <div className="contact-value">{form.phoneNo}</div>
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
            <div className={`panel-content ${isSecurityOpen ? "open" : ""}`}>
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

          {!isSecurityOpen && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
