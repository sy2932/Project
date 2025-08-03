const AuthUtils = {
  encode: function (data) {
    return btoa(JSON.stringify(data));
  },

  decode: function (encodedData) {
    try {
      return JSON.parse(atob(encodedData));
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: function () {
    return localStorage.getItem("userLoggedIn") === "true";
  },

  getCurrentUser: function () {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  },

  setCurrentUser: function (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("userLoggedIn", "true");
  },

  logout: function () {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedCustomerId");
    window.location.href = "index.html";
  },

  validateEmail: function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone: function (phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  checkPasswordStrength: function (password) {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push("Include lowercase letters");
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push("Include uppercase letters");
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push("Include numbers");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    } else {
      feedback.push("Include special characters");
    }

    return {
      score: score,
      isStrong: score >= 4,
      feedback: feedback,
    };
  },

  updateLastActivity: function () {
    localStorage.setItem("lastActivity", Date.now().toString());
  },

  checkSessionTimeout: function () {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity) {
      const timeElapsed = Date.now() - parseInt(lastActivity);
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeElapsed > thirtyMinutes) {
        this.logout();
        alert("Your session has expired. Please log in again.");
        return false;
      }
    }
    this.updateLastActivity();
    return true;
  },
};

const CustomerUtils = {
  getCustomers: function () {
    return JSON.parse(localStorage.getItem("customers")) || [];
  },

  saveCustomers: function (customers) {
    localStorage.setItem("customers", JSON.stringify(customers));
  },

  addCustomer: function (customerData) {
    const customers = this.getCustomers();
    const newCustomer = {
      id: Date.now(),
      ...customerData,
      addedBy: AuthUtils.getCurrentUser()?.email,
      dateAdded: new Date().toISOString(),
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  },

  deleteCustomer: function (customerId) {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(
      (customer) => customer.id !== customerId
    );
    this.saveCustomers(filteredCustomers);
    return true;
  },

  searchCustomers: function (searchTerm) {
    const customers = this.getCustomers();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.includes(searchTerm)
    );
  },
};

const FormUtils = {
  showError: function (fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector(".error-message");

    if (errorDiv) {
      errorDiv.textContent = message;
    } else {
      const newErrorDiv = document.createElement("div");
      newErrorDiv.className = "error-message text-danger small mt-1";
      newErrorDiv.textContent = message;
      field.parentNode.appendChild(newErrorDiv);
    }

    field.classList.add("is-invalid");
  },

  clearError: function (fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector(".error-message");

    if (errorDiv) {
      errorDiv.remove();
    }

    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  },

  clearAllErrors: function (formId) {
    const form = document.getElementById(formId);
    const errorMessages = form.querySelectorAll(".error-message");
    const invalidFields = form.querySelectorAll(".is-invalid");

    errorMessages.forEach((error) => error.remove());
    invalidFields.forEach((field) => {
      field.classList.remove("is-invalid");
    });
  },
};

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    if (AuthUtils.isAuthenticated()) {
      AuthUtils.checkSessionTimeout();
      setInterval(() => {
        AuthUtils.checkSessionTimeout();
      }, 5 * 60 * 1000);
    }
  });
  document.addEventListener("click", AuthUtils.updateLastActivity);
  document.addEventListener("keypress", AuthUtils.updateLastActivity);
}
