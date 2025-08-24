import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onFirstLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [allowReset, setAllowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const modalRef = useRef(null);

  const questionOptions = [
    "What is your favorite book?",
    "What is your first pet's name?",
    "What is your dream job?",
  ];

  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@sc\.com$/.test(email);

  const validatePassword = (pass) => {
    if (pass.length < 12) {
      return "Password must be at least 12 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(pass)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      value && !validateEmail(value)
        ? "Only @sc.com email addresses are allowed"
        : ""
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordError(validatePassword(value));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      setCaptchaError("Captcha does not match");
      return;
    }
    if (passwordError) {
      return;
    }
    const adminEmail = "admin@sc.com";
    const adminPassword = "Admin@12345!";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("loginEmail", email);
      localStorage.setItem("isAdmin", "true");
      navigate("/adminDashboard");
      return;
    }
    const rawAccounts = localStorage.getItem("signedUpAccounts");
    let accounts = [];
    try {
      accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
    } catch (err) {
      accounts = [];
    }
    const found = accounts.find((acc) => acc.email === email);
    if (!found) {
      setEmailError("Account does not exist. Please sign up.");
      return;
    }
    localStorage.setItem("loginEmail", email);
    localStorage.removeItem("isAdmin");
    const firstLoginFlagKey = `employeeFirstLogin_${email}`;
    const hasLoggedBefore = localStorage.getItem(firstLoginFlagKey) === "true";
    if (!hasLoggedBefore) {
      localStorage.setItem(firstLoginFlagKey, "true");
      navigate("/employeedetails");
      return;
    }
    navigate("/employeeDashboard");
  };

  return (
    <div className="login-page">
      <button type="button" className="close-btn" aria-label="Close">
        ✕
      </button>
      <div className="logo-pane">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Standard_Chartered_Logo_%282021%2C_Logo_only%29.svg"
          alt="Standard Chartered Logo"
          className="brand-logo"
          draggable="false"
        />
        <div className="logo-text">
          <span className="logo-rw">RW</span>
          <span className="logo-tool">Tool</span>
        </div>
      </div>

      <div className="white-container">
        <h2 className="form-title">Welcome Back!</h2>
        <form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <div className="pill-wrapper">
              <input
                id="email"
                type="email"
                className="pill-input"
                placeholder="Enter your @sc.com email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="pill-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pill-input"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>

          <div
            className="forgot-row"
            style={{ textAlign: "right", marginTop: "8px" }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgot(true);
              }}
            >
              Forgot Password?
            </a>
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="captchaInput">
              Captcha
            </label>
            <div className="pill-wrapper captcha-wrapper">
              <div className="captcha-generated">{captcha}</div>
              <button
                type="button"
                className="refresh-btn"
                onClick={refreshCaptcha}
              >
                ↻
              </button>
              <input
                type="text"
                id="captchaInput"
                placeholder="Enter Captcha"
                className="pill-input captcha-input"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
            </div>
            {captchaError && (
              <div className="error-message">{captchaError}</div>
            )}
          </div>

          <div className="actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={!!emailError || !!passwordError}
            >
              Login
            </button>
          </div>

          <div className="form-footer">
            <div className="footer-left">
              <span>Don't have an account? </span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Sign Up
              </a>
            </div>
            <div className="footer-right">
              <a href="#">Terms &amp; Conditions</a>
            </div>
          </div>
        </form>

        {showForgot && (
          <div
            className="forgot-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
            }}
            onClick={(e) => {
              if (e.target.className === "forgot-modal-overlay") {
                setShowForgot(false);
                setSecurityQuestion("");
                setUserAnswer("");
                setAllowReset(false);
              }
            }}
          >
            <div
              ref={modalRef}
              className="forgot-modal"
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "28px 24px",
                minWidth: "320px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Forgot Password</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotEmail) {
                    setForgotEmailError("Enter your email");
                    return;
                  }
                  if (!validateEmail(forgotEmail)) {
                    setForgotEmailError("Invalid email");
                    return;
                  }
                  setForgotEmailError("");
                  setSecurityQuestion(questionOptions[0]);
                  setSecurityAnswer("bookAnswer");
                }}
              >
                <div className="form-field">
                  <label htmlFor="forgotEmail">Email</label>
                  <input
                    id="forgotEmail"
                    type="email"
                    className="pill-input"
                    placeholder="Enter your @sc.com email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  {forgotEmailError && (
                    <div className="error-message">{forgotEmailError}</div>
                  )}
                </div>

                {securityQuestion && (
                  <div className="security-question" style={{ marginTop: 16 }}>
                    <label>Security Question</label>
                    <select
                      value={securityQuestion}
                      onChange={(e) => setSecurityQuestion(e.target.value)}
                      required
                    >
                      {questionOptions.map((q, i) => (
                        <option key={i} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="pill-input"
                      placeholder="Your answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (userAnswer === securityAnswer) {
                          setAllowReset(true);
                          setSecurityError("");
                        } else {
                          setSecurityError("Incorrect answer");
                          setAllowReset(false);
                        }
                      }}
                    >
                      Check Answer
                    </button>
                    {securityError && (
                      <div className="error-message">{securityError}</div>
                    )}
                  </div>
                )}

                {allowReset && (
                  <div className="reset-section" style={{ marginTop: 16 }}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      className="pill-input"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                    {newPasswordError && (
                      <div className="error-message">{newPasswordError}</div>
                    )}
                    <button
                      type="button"
                      disabled={!!newPasswordError || !newPassword}
                      onClick={() => {
                        setShowForgot(false);
                        setAllowReset(false);
                        setSecurityQuestion("");
                        setUserAnswer("");
                        alert("Password reset successful (simulated)");
                      }}
                    >
                      Reset Password
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
