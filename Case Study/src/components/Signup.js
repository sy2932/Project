import React, { useState, useEffect } from "react";
import "./Signup.css";

import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [modalError, setModalError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const questionOptions = [
    "What is your favorite book?",
    "What is your first pet's name?",
    "What is your dream job?",
    "What city were you born in?",
    "What is your favorite food?",
    "What is your favorite movie?",
  ];

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Initialize captcha
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // Refresh captcha
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@sc\.com$/;
    return regex.test(email);
  };

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
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
  setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Only @sc.com email addresses are allowed");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));

    // Validate password match if confirm password exists
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
  if (captchaError) setCaptchaError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setCaptchaError("");

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid @sc.com email address");
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    }

    // Validate captcha
    if (captchaInput !== captcha) {
      setCaptchaError("Captcha does not match");
      return;
    }

    // Validate terms
    if (!acceptTerms) {
      return;
    }

    // Persist account (simple localStorage list)
    const raw = localStorage.getItem("signedUpAccounts");
    let accounts = [];
    try {
      accounts = raw ? JSON.parse(raw) : [];
    } catch {
      accounts = [];
    }
    if (!accounts.find((a) => a.email === email)) {
      accounts.push({
        email,
        password,
        question: userQuestion,
        answer: userAnswer,
      });
      localStorage.setItem("signedUpAccounts", JSON.stringify(accounts));
    }

    // Redirect to login page after successful signup
    navigate("/login");
  };

  return (
    <div className="signup-page">
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
        <div className="logo-text" aria-label="RW Tool Brand">
          <span className="logo-rw">RW</span>
          <span className="logo-tool">Tool</span>
        </div>
      </div>

      <div className="white-container">
        <h2 className="form-title">Join Now!</h2>

        <form
          className="signup-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
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
          <div className="form-field combined-password-field">
            <label htmlFor="password" className="field-label">
              Password <span className="password-hint"></span>
            </label>
            <div className="pill-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pill-input"
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <span className="visually-hidden">Hide</span>
                ) : (
                  <span className="visually-hidden">Show</span>
                )}
              </button>
            </div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            <label
              htmlFor="confirmPassword"
              className="field-label"
              style={{ marginTop: "12px" }}
            >
              Re-Enter Password
            </label>
            <div className="pill-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="pill-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <span className="visually-hidden">Hide</span>
                ) : (
                  <span className="visually-hidden">Show</span>
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <div className="error-message">{confirmPasswordError}</div>
            )}
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="captchaInput">
              Captcha
            </label>
            <div className="pill-wrapper captcha-wrapper">
              <div className="captcha-generated" aria-live="polite">
                {captcha}
              </div>
              <button
                type="button"
                className="refresh-btn"
                aria-label="Reload captcha"
                title="Reload captcha"
                onClick={refreshCaptcha}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#2f7edb"
                >
                  <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                </svg>
              </button>
              <input
                type="text"
                id="captchaInput"
                placeholder="Enter Captcha"
                className="pill-input captcha-input"
                aria-describedby="captchaHelp"
                value={captchaInput}
                onChange={handleCaptchaChange}
                required
              />
            </div>
            {captchaError && (
              <div className="error-message">{captchaError}</div>
            )}
            <span id="captchaHelp" className="visually-hidden">
              Type the characters shown before the refresh button.
            </span>
          </div>
          <div className="form-field">
            <div className="pill-wrapper security-question-pill">
              <label className="field-label" style={{ marginBottom: 0 }}>
                Security Question
              </label>
              <button
                type="button"
                className="primary-btn"
                style={{
                  maxWidth: "200px",
                  minWidth: "140px",
                  fontSize: "0.88rem",
                  padding: "7px 18px",
                  marginLeft: "auto",
                  display: "block",
                }}
                onClick={() => setShowQuestionModal(true)}
              >
                Select & Answer
              </button>
            </div>
          </div>
          {userQuestion && (
            <div className="security-summary">
              <span>
                <b>Selected:</b> {userQuestion}
              </span>
              <span>
                <b>Answer:</b> {userAnswer ? "(set)" : "(not set)"}
              </span>
            </div>
          )}
          {showQuestionModal && (
            <div
              className="security-modal-overlay"
              onClick={(e) => {
                if (e.target.classList.contains("security-modal-overlay")) {
                  setShowQuestionModal(false);
                }
              }}
            >
              <div className="security-modal">
                <h3>Select a Security Question</h3>
                <div className="modal-questions-list">
                  {questionOptions.map((q, i) => (
                    <div key={i} className="modal-question-row">
                      <input
                        type="radio"
                        id={`modal-q${i}`}
                        name="modal-question"
                        value={q}
                        checked={selectedQuestion === q}
                        onChange={() => setSelectedQuestion(q)}
                      />
                      <label htmlFor={`modal-q${i}`}>{q}</label>
                    </div>
                  ))}
                </div>
                <div className="modal-answer-row">
                  <label htmlFor="modalAnswer">Your Answer</label>
                  <input
                    id="modalAnswer"
                    type="text"
                    className="pill-input"
                    placeholder="Type your answer"
                    value={modalAnswer}
                    onChange={(e) => setModalAnswer(e.target.value)}
                  />
                </div>
                {modalError && (
                  <div className="error-message">{modalError}</div>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      if (!selectedQuestion) {
                        setModalError("Please select a question");
                        return;
                      }
                      if (!modalAnswer) {
                        setModalError("Please enter your answer");
                        return;
                      }
                      setUserQuestion(selectedQuestion);
                      setUserAnswer(modalAnswer);
                      setShowQuestionModal(false);
                      setModalError("");
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="terms-row">
            <label className="checkbox-wrapper">
              <input
                id="acceptTerms"
                type="checkbox"
                className="native-checkbox"
                aria-required="true"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span className="custom-box" aria-hidden="true"></span>
              <span className="terms-text">
                Accept{" "}
                <a href="#" className="terms-link">
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>
          <div className="actions">
            <button type="submit" className="primary-btn">
              Create Account
            </button>
          </div>
          <div className="form-footer" role="contentinfo">
            <div className="footer-left">
              <span className="have-account">Have an account? </span>
              <a
                href="#"
                className="login-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Login
              </a>
            </div>
            <div className="footer-right">
              <a href="#" className="footer-terms-link">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
