document.addEventListener("DOMContentLoaded", function () {
  updateNavbar();
  addSmoothScrolling();
  addScrollAnimations();
});

function updateNavbar() {
  const authSection = document.getElementById("authSection");

  if (localStorage.getItem("userLoggedIn") === "true") {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    authSection.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i> ${currentUser.firstName}
                </a>
                <ul class="dropdown-menu">
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="customer.html"><i class="bi bi-person-gear"></i> Customer Management</a></li>
                    <li>
                        <a class="dropdown-item" href="#" id="dashboardsToggle">
                            <i class="bi bi-speedometer2"></i> Dashboards
                            <i class="bi bi-chevron-down float-end" id="dashboardsChevron"></i>
                        </a>
                    </li>
                    <div id="dashboardsSection" class="d-none">
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">Your Accounts</h6></li>
                        <li id="indexNoDashboards" class="d-none">
                            <a class="dropdown-item text-muted ms-3" href="#">
                                <i class="bi bi-info-circle"></i> No accounts created yet
                            </a>
                        </li>
                        <div id="indexDashboardItems"></div>
                    </div>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                </ul>
            </li>
        `;
    populateIndexDashboardDropdown();
    initializeDashboardsToggle();
  } else {
    authSection.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i> Account
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="login.html"><i class="bi bi-box-arrow-in-right"></i> Login</a></li>
                    <li><a class="dropdown-item" href="signup.html"><i class="bi bi-person-plus"></i> Sign Up</a></li>
                </ul>
            </div>
        `;
  }
}

function addSmoothScrolling() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);
  const animateElements = document.querySelectorAll(
    ".service-card, .feature-item, .hero-content"
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

function navigateToLogin() {
  window.location.href = "login.html";
}

function navigateToSignup() {
  window.location.href = "signup.html";
}

function navigateToDashboard() {
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

function navigateToCustomer() {
  window.location.href = "customer.html";
}

function logout() {
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("currentUser");
  updateNavbar();
  alert("Logged out successfully!");
}

function populateIndexDashboardDropdown() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const userCustomers = customers.filter(
    (customer) => customer.userId === currentUser.id
  );

  const dashboardItems = document.getElementById("indexDashboardItems");
  const noDashboards = document.getElementById("indexNoDashboards");

  if (!dashboardItems) return;

  dashboardItems.innerHTML = "";

  if (userCustomers.length === 0) {
    noDashboards.classList.remove("d-none");
  } else {
    noDashboards.classList.add("d-none");

    userCustomers.forEach((customer) => {
      const link = document.createElement("a");
      link.className = "dropdown-item ms-3";
      link.href = "#";
      link.onclick = () => navigateToIndexDashboard(customer.id);

      const accountTypeIcon = getIndexAccountTypeIcon(customer.accountType);
      link.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi ${accountTypeIcon} me-2"></i>
                    <div>
                        <div class="fw-semibold">${customer.name}</div>
                        <small class="text-muted">${customer.accountType} - ${
        customer.accountNumber || "N/A"
      }</small>
                    </div>
                </div>
            `;

      dashboardItems.appendChild(link);
    });
  }
}

function initializeDashboardsToggle() {
  const dashboardsToggle = document.getElementById("dashboardsToggle");
  const dashboardsSection = document.getElementById("dashboardsSection");
  const dashboardsChevron = document.getElementById("dashboardsChevron");

  if (dashboardsToggle && dashboardsSection && dashboardsChevron) {
    dashboardsToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      dashboardsSection.classList.toggle("d-none");

      if (dashboardsSection.classList.contains("d-none")) {
        dashboardsChevron.classList.remove("bi-chevron-up");
        dashboardsChevron.classList.add("bi-chevron-down");
      } else {
        dashboardsChevron.classList.remove("bi-chevron-down");
        dashboardsChevron.classList.add("bi-chevron-up");
      }
    });
  }
}

function getIndexAccountTypeIcon(accountType) {
  switch (accountType) {
    case "Savings":
      return "bi-piggy-bank";
    case "Current":
      return "bi-briefcase";
    case "Fixed Deposit":
      return "bi-safe";
    case "Recurring Deposit":
      return "bi-arrow-repeat";
    default:
      return "bi-bank";
  }
}

function navigateToIndexDashboard(customerId) {
  localStorage.setItem("selectedCustomerId", customerId);
  window.location.href = "dashboard.html";
}

const style = document.createElement("style");
style.textContent = `
    .service-card, .feature-item, .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .service-card.animate-in, .feature-item.animate-in, .hero-content.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero-content {
        animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
