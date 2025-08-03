document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginAlert = document.getElementById("loginAlert");

  if (localStorage.getItem("userLoggedIn") === "true") {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const userCustomers = customers.filter(
      (customer) => customer.userId === currentUser.id
    );

    if (userCustomers.length > 0) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "customer.html";
    }
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    loginAlert.classList.add("d-none");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.removeItem("selectedCustomerId");

      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      const userCustomers = customers.filter(
        (customer) => customer.userId === user.id
      );

      if (userCustomers.length > 0) {
        showAlert("Login successful! Redirecting to dashboard...", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        showAlert(
          "Login successful! Please complete your customer profile...",
          "success"
        );
        setTimeout(() => {
          window.location.href = "customer.html";
        }, 1500);
      }
    } else {
      showAlert("Invalid email or password. Please try again.", "danger");
    }
  });

  function showAlert(message, type) {
    loginAlert.className = `alert alert-custom alert-${type}`;
    loginAlert.textContent = message;
    loginAlert.classList.remove("d-none");
  }
});
