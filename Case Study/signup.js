document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signupAlert = document.getElementById("signupAlert");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordStrength = document.getElementById("passwordStrength");
  const passwordMatch = document.getElementById("passwordMatch");

  if (localStorage.getItem("userLoggedIn") === "true") {
    window.location.href = "customer.html";
  }

  passwordInput.addEventListener("input", function () {
    const password = this.value;
    const strength = checkPasswordStrength(password);

    passwordStrength.textContent = strength.text;
    passwordStrength.className = `password-strength ${strength.class}`;
  });
  confirmPasswordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    const confirmPassword = this.value;

    if (confirmPassword === "") {
      passwordMatch.textContent = "";
      return;
    }

    if (password === confirmPassword) {
      passwordMatch.textContent = "Passwords match ✓";
      passwordMatch.className = "password-strength strength-strong";
    } else {
      passwordMatch.textContent = "Passwords do not match ✗";
      passwordMatch.className = "password-strength strength-weak";
    }
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    signupAlert.classList.add("d-none");

    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", "danger");
      return;
    }

    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "danger");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(
      (user) => user.email === formData.get("email")
    );

    if (emailExists) {
      showAlert("An account with this email already exists.", "danger");
      return;
    }

    const newUser = {
      id: Date.now(),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      subscribeNewsletter: formData.get("subscribeNewsletter") === "on",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.removeItem("selectedCustomerId");

    showAlert("Account created successfully! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "customer.html";
    }, 2000);
  });

  function checkPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) {
      return { score, text: "Weak password", class: "strength-weak" };
    } else if (score < 4) {
      return { score, text: "Medium strength", class: "strength-medium" };
    } else {
      return { score, text: "Strong password", class: "strength-strong" };
    }
  }

  function showAlert(message, type) {
    signupAlert.className = `alert alert-custom alert-${type}`;
    signupAlert.textContent = message;
    signupAlert.classList.remove("d-none");
  }
});
