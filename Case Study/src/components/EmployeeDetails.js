import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeDetails.css";

function EmployeeDetails() {
  const { useNavigate } = require("react-router-dom");
  const navigate = useNavigate();
  const [employeeIdWarning, setEmployeeIdWarning] = useState("");
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const loginEmail = localStorage.getItem("loginEmail") || "";
  const existingPerUser = (() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(`employeeDetails_${loginEmail}`) || "null"
        ) || {}
      );
    } catch {
      return {};
    }
  })();
  const [form, setForm] = useState({
    firstName: existingPerUser.firstName || "",
    lastName: existingPerUser.lastName || "",
    mailId: loginEmail,
    phoneNo: existingPerUser.phoneNo || "",
    employeeId: existingPerUser.employeeId || "",
    role: existingPerUser.role || "",
    department: existingPerUser.department || "",
  });
  const [phoneWarning, setPhoneWarning] = useState("");
  const [emailWarning, setEmailWarning] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeId") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setForm({ ...form, [name]: numericValue });
      if (numericValue.length !== 7) {
        setEmployeeIdWarning("Employee ID must be exactly 7 digits.");
      } else {
        setEmployeeIdWarning("");
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    if (name === "phoneNo") {
      const phonePattern = /^[6-9][0-9]{9}$/;
      setPhoneWarning(
        phonePattern.test(value) ? "" : "Enter a valid phone number"
      );
    }
    if (name === "mailId") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailWarning(
        emailPattern.test(value) ? "" : "Enter a valid email address"
      );
    }
  };

  const handlePhotoUpload = (e) => {
    setPhotoError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setPhotoError("Only PNG, JPG, and JPEG formats are allowed.");
        return;
      }
      if (file.size > 1024 * 1024) {
        setPhotoError("File size must be 1MB or less.");
        return;
      }
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Saved!");
    localStorage.setItem(`employeeDetails_${loginEmail}`, JSON.stringify(form));
    if (photo) {
      localStorage.setItem(`employeePhoto_${loginEmail}`, photo);
    }
    if (!localStorage.getItem("employeeDetails")) {
      localStorage.setItem("employeeDetails", JSON.stringify(form));
      if (photo && !localStorage.getItem("employeePhoto")) {
        localStorage.setItem("employeePhoto", photo);
      }
    }
    navigate("/employeeDashboard");
    setForm({
      firstName: "",
      lastName: "",
      mailId: "",
      phoneNo: "",
      employeeId: "",
      role: "",
      department: "",
    });
  };

  return (
    <div className="main-bg">
      <div className="header container-fluid py-2">
        <div className="navbar-left d-flex align-items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_%282021%29.svg"
            alt="logo"
            className="navbar-logo-profile img-fluid"
          />
        </div>
      </div>

      <form
        className="container-fluid form-container mt-4"
        onSubmit={handleSubmit}
      >
        <div className="row">
          <div className="col-lg-8 col-md-7 mb-4">
            <div className="card personal-details h-100">
              <div className="card-header personal-title-inside">
                Personal Details
              </div>
              <div className="card-body personal-fields">
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="field-group">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="field-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="field-group">
                      <label htmlFor="mailId" className="form-label">
                        Mail Id
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="mailId"
                        name="mailId"
                        value={form.mailId}
                        readOnly
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Please enter a valid email address"
                        required
                      />
                      {emailWarning && (
                        <div className="text-danger small mt-1">
                          {emailWarning}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="field-group">
                      <label htmlFor="phoneNo" className="form-label">
                        Phone.No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNo"
                        name="phoneNo"
                        value={form.phoneNo}
                        onChange={handleChange}
                        pattern="[6-9][0-9]{9}"
                        maxLength="10"
                        title="Phone number must start with 6-9 and be exactly 10 digits"
                        required
                      />
                      {phoneWarning && (
                        <div className="text-danger small mt-1">
                          {phoneWarning}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-5 mb-4">
            <div className="card photo-upload h-100 d-flex flex-column justify-content-center align-items-center py-4">
              <div className="photo-img-container mb-3">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="photo-img large-profile"
                    style={{
                      width: "130px",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "2px solid #1976d2",
                    }}
                  />
                ) : (
                  <span className="photo-img large-profile d-inline-block">
                    <svg
                      fill="#000000"
                      height="126px"
                      width="126px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path d="M256,65.362c-51.057,0-92.596,41.538-92.596,92.596s41.538,92.596,92.596,92.596s92.596-41.538,92.596-92.596 S307.057,65.362,256,65.362z M256,234.213c-42.047,0-76.255-34.208-76.255-76.255S213.953,81.702,256,81.702 s76.255,34.208,76.255,76.255S298.047,234.213,256,234.213z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M275.22,163.772c-4.218-1.587-8.936,0.545-10.525,4.768c-1.26,3.351-4.755,5.603-8.693,5.603 c-3.939,0-7.433-2.251-8.693-5.602c-1.589-4.223-6.3-6.355-10.524-4.769c-4.223,1.589-6.359,6.301-4.769,10.524 c3.642,9.681,13.281,16.186,23.986,16.186c10.703,0,20.343-6.505,23.988-16.185C281.577,170.074,279.442,165.363,275.22,163.772z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M407.388,387.634c-7.663-33.762-26.794-64.409-53.869-86.295c-27.482-22.212-62.114-34.446-97.519-34.446 s-70.036,12.234-97.519,34.448c-27.076,21.886-46.207,52.534-53.869,86.296c-0.998,4.401,1.759,8.777,6.16,9.776 c0.609,0.137,1.217,0.205,1.816,0.205c3.731,0,7.1-2.572,7.961-6.364c14.431-63.601,70.131-108.02,135.45-108.02 c65.318,0,121.018,44.418,135.451,108.018c0.999,4.4,5.376,7.149,9.777,6.159C405.628,396.412,408.385,392.035,407.388,387.634z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M443.915,0H68.085c-4.513,0-8.17,3.657-8.17,8.17v413.957c0,4.513,3.657,8.17,8.17,8.17h375.83 c4.513,0,8.17-3.657,8.17-8.17V8.17C452.085,3.657,448.428,0,443.915,0z M435.745,413.957H76.255V16.34h359.489V413.957z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M443.915,454.809h-65.362c-4.513,0-8.17,3.657-8.17,8.17c0,4.513,3.657,8.17,8.17,8.17h65.362 c4.513,0,8.17-3.657,8.17-8.17C452.085,458.466,448.428,454.809,443.915,454.809z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M345.872,454.809H68.085c-4.513,0-8.17,3.657-8.17,8.17c0,4.513,3.657,8.17,8.17,8.17h277.787 c4.513,0,8.17-3.657,8.17-8.17C354.043,458.466,350.386,454.809,345.872,454.809z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M256,495.66H68.085c-4.513,0-8.17,3.657-8.17,8.17s3.657,8.17,8.17,8.17H256c4.513,0,8.17-3.657,8.17-8.17 S260.513,495.66,256,495.66z" />
                        </g>
                      </g>
                    </svg>
                  </span>
                )}
                {photoError && (
                  <div className="text-danger small mt-2">{photoError}</div>
                )}
              </div>
              <label className="btn upload-btn">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handlePhotoUpload}
                />
                <span className="upload-icon ms-2">&#8682;</span>
              </label>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card employee-details">
              <div className="card-header employee-title-inside">
                Employee Details
              </div>
              <div className="card-body employee-fields">
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="field-group">
                      <label htmlFor="employeeId" className="form-label">
                        Employee Id
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="employeeId"
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        maxLength={7}
                        pattern="^[0-9]{7}$"
                        title="Employee ID must be exactly 7 digits"
                      />
                      {employeeIdWarning && (
                        <div className="text-danger small mt-1">
                          {employeeIdWarning}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="field-group">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="field-group"
                      style={{ position: "relative" }}
                    >
                      <label htmlFor="department" className="form-label">
                        Department
                      </label>
                      {deptDropdownOpen && (
                        <ul
                          className="dropdown-menu w-100 show"
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: 0,
                            zIndex: 10,
                            border: "2px solid #43ea1b",
                            borderRadius: "15px",
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                          role="listbox"
                        >
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              type="button"
                              onClick={() => {
                                setForm({ ...form, department: "" });
                                setDeptDropdownOpen(false);
                              }}
                            >
                              Clear Selection
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          {["HR", "IT", "Finance", "Marketing"].map((dept) => (
                            <li key={dept}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, department: dept });
                                  setDeptDropdownOpen(false);
                                }}
                              >
                                {dept}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        className="form-select dropdown-toggle"
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingRight: "2.2em",
                          position: "relative",
                        }}
                        onClick={() => setDeptDropdownOpen((open) => !open)}
                        aria-haspopup="listbox"
                        aria-expanded={deptDropdownOpen}
                      >
                        <span>
                          {form.department ? form.department : "Select"}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            right: "1em",
                            pointerEvents: "none",
                          }}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <button className="btn save-btn px-5 py-2" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EmployeeDetails;
