document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("userLoggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("userDisplayName").textContent =
      currentUser.firstName;
    document.getElementById("welcomeUser").textContent =
      currentUser.firstName + " " + currentUser.lastName;

    document.getElementById("emailAddress").value = currentUser.email;
  }

  loadCustomerData();
  populateDashboardDropdown();

  document
    .getElementById("sameAsPermananent")
    .addEventListener("change", function () {
      const correspondenceAddress = document.getElementById(
        "correspondenceAddress"
      );
      if (this.checked) {
        correspondenceAddress.value =
          document.getElementById("permanentAddress").value;
      } else {
        correspondenceAddress.value = "";
      }
    });

  document
    .getElementById("permanentAddress")
    .addEventListener("input", function () {
      const checkbox = document.getElementById("sameAsPermananent");
      if (checkbox.checked) {
        document.getElementById("correspondenceAddress").value = this.value;
      }
    });

  document
    .getElementById("customerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        fullName: document.getElementById("fullName").value,
        guardianName: document.getElementById("guardianName").value,
        dateOfBirth: document.getElementById("dateOfBirth").value,
        gender: document.getElementById("gender").value,
        maritalStatus: document.getElementById("maritalStatus").value,
        nationality: document.getElementById("nationality").value,
        occupation: document.getElementById("occupation").value,
        residentialStatus: document.getElementById("residentialStatus").value,
        permanentAddress: document.getElementById("permanentAddress").value,
        correspondenceAddress:
          document.getElementById("correspondenceAddress").value ||
          document.getElementById("permanentAddress").value,
        mobileNumber: document.getElementById("mobileNumber").value,
        emailAddress: document.getElementById("emailAddress").value,
        landline: document.getElementById("landline").value,
        aadhaarNumber: document.getElementById("aadhaarNumber").value,
        panNumber: document.getElementById("panNumber").value.toUpperCase(),
        accountType: document.getElementById("accountType").value,
        initialDeposit: document.getElementById("initialDeposit").value,
      };

      const customer = {
        id: Date.now(),
        userId: currentUser.id,
        name: formData.fullName,
        email: formData.emailAddress,
        contact: formData.mobileNumber,
        accountType: formData.accountType,
        accountNumber: generateAccountNumber(),

        personalDetails: {
          fullName: formData.fullName,
          guardianName: formData.guardianName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          nationality: formData.nationality,
          occupation: formData.occupation,
          residentialStatus: formData.residentialStatus,
        },
        contactDetails: {
          permanentAddress: formData.permanentAddress,
          correspondenceAddress: formData.correspondenceAddress,
          mobileNumber: formData.mobileNumber,
          emailAddress: formData.emailAddress,
          landline: formData.landline,
        },
        kycDetails: {
          aadhaarNumber: formData.aadhaarNumber,
          panNumber: formData.panNumber,
        },
        accountDetails: {
          accountType: formData.accountType,
          initialDeposit: parseFloat(formData.initialDeposit),
          balance: parseFloat(formData.initialDeposit),
        },

        addedBy: currentUser.email,
        dateAdded: new Date().toISOString(),
        transactions: [],
      };

      if (!validatePAN(formData.panNumber)) {
        alert("Please enter a valid PAN number (e.g., ABCDE1234F)");
        return;
      }

      if (!validateAadhaar(formData.aadhaarNumber)) {
        alert("Please enter a valid 12-digit Aadhaar number");
        return;
      }

      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      const existingCustomer = customers.find(
        (c) =>
          c.kycDetails.panNumber === formData.panNumber ||
          c.kycDetails.aadhaarNumber === formData.aadhaarNumber
      );

      if (existingCustomer) {
        alert("A customer with this PAN or Aadhaar number already exists!");
        return;
      }

      customers.push(customer);
      localStorage.setItem("customers", JSON.stringify(customers));

      addCustomerToTable(customer);

      document.getElementById("customerForm").reset();
      document.getElementById("emailAddress").value = currentUser.email;
      populateDashboardDropdown();
      alert(
        "Customer account created successfully! Redirecting to customer dashboard..."
      );
      setTimeout(() => {
        localStorage.setItem("selectedCustomerId", customer.id);
        window.location.href = `dashboard.html`;
      }, 1500);
    });
});

function generateAccountNumber() {
  return (
    "4026" +
    Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0")
  );
}

function validatePAN(pan) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

function validateAadhaar(aadhaar) {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar);
}

function addCustomerToTable(customer) {
  const table = document.getElementById("customerTable");
  const newRow = table.insertRow();

  newRow.innerHTML = `
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.contact}</td>
        <td>${customer.accountType}</td>
        <td>
            <button class="btn btn-sm btn-primary me-2" onclick="viewCustomerDashboard(${customer.id})" title="View Dashboard">
                <i class="bi bi-speedometer2"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id}, this)" title="Delete Customer">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
}

function loadCustomerData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customers = JSON.parse(localStorage.getItem("customers")) || [];

  const userCustomers = customers.filter(
    (customer) => customer.userId === currentUser.id
  );

  userCustomers.forEach((customer) => {
    addCustomerToTable(customer);
  });

  populateDashboardDropdown();
}

function viewCustomerDashboard(customerId) {
  localStorage.setItem("selectedCustomerId", customerId);
  window.location.href = `dashboard.html`;
}

function deleteCustomer(customerId, buttonElement) {
  if (confirm("Are you sure you want to delete this customer account?")) {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    customers = customers.filter((customer) => customer.id !== customerId);
    localStorage.setItem("customers", JSON.stringify(customers));

    buttonElement.closest("tr").remove();

    populateDashboardDropdown();
    alert("Customer account deleted successfully!");
  }
}

function populateDashboardDropdown() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const userCustomers = customers.filter(
    (customer) => customer.userId === currentUser.id
  );

  const dropdown = document.getElementById("dashboardDropdown");
  const noDashboards = document.getElementById("noDashboards");

  const existingItems = dropdown.querySelectorAll(".dashboard-item");
  existingItems.forEach((item) => item.remove());

  if (userCustomers.length === 0) {
    noDashboards.classList.remove("d-none");
  } else {
    noDashboards.classList.add("d-none");

    userCustomers.forEach((customer) => {
      const listItem = document.createElement("li");
      listItem.className = "dashboard-item";

      const link = document.createElement("a");
      link.className = "dropdown-item";
      link.href = "#";
      link.onclick = () => navigateToDashboard(customer.id);

      const accountTypeIcon = getAccountTypeIcon(customer.accountType);
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

      listItem.appendChild(link);
      dropdown.appendChild(listItem);
    });
  }
}

function getAccountTypeIcon(accountType) {
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

function navigateToDashboard(customerId) {
  localStorage.setItem("selectedCustomerId", customerId);
  window.location.href = "dashboard.html";
}
