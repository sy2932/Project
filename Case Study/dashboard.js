let currentCustomer = null;

document.addEventListener("DOMContentLoaded", function () {
  // Validate and initialize data integrity
  validateAndInitializeData();

  // Load customer data
  initializeDashboard();
});

function validateAndInitializeData() {
  try {
    // Validate customers data
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let dataUpdated = false;

    customers.forEach((customer) => {
      // Ensure balance is a number
      if (typeof customer.balance !== "number" || isNaN(customer.balance)) {
        customer.balance =
          parseFloat(customer.balance) ||
          (customer.accountDetails
            ? customer.accountDetails.initialDeposit || 1000
            : 1000);
        dataUpdated = true;
      }

      // Ensure transactions array exists
      if (!Array.isArray(customer.transactions)) {
        customer.transactions = [];

        // Add initial deposit transaction if balance > 0 and no transactions exist
        if (customer.balance > 0) {
          const initialTransaction = {
            id: `INIT_${customer.id}_${Date.now()}`,
            type: "credit",
            amount: customer.balance,
            description: "Initial Account Opening Deposit",
            date: customer.dateAdded || new Date().toISOString(),
            remark: "Account opening balance",
            status: "completed",
          };
          customer.transactions.push(initialTransaction);
        }
        dataUpdated = true;
      }

      // Ensure account number exists
      if (!customer.accountNumber) {
        customer.accountNumber = generateAccountNumber();
        dataUpdated = true;
      }

      // Validate transaction data integrity
      if (customer.transactions) {
        customer.transactions.forEach((transaction) => {
          if (typeof transaction.amount !== "number") {
            transaction.amount = parseFloat(transaction.amount) || 0;
            dataUpdated = true;
          }
          if (!transaction.status) {
            transaction.status = "completed";
            dataUpdated = true;
          }
          if (!transaction.id) {
            transaction.id = `TXN_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`;
            dataUpdated = true;
          }
        });
      }
    });

    // Save updated data if any corrections were made
    if (dataUpdated) {
      localStorage.setItem("customers", JSON.stringify(customers));
      console.log("Data integrity validation completed - corrections applied");
    }

    // Validate money requests data
    let moneyRequests = JSON.parse(localStorage.getItem("moneyRequests")) || [];
    let requestsUpdated = false;

    moneyRequests.forEach((request) => {
      if (typeof request.amount !== "number") {
        request.amount = parseFloat(request.amount) || 0;
        requestsUpdated = true;
      }
      if (!request.status) {
        request.status = "pending";
        requestsUpdated = true;
      }
    });

    if (requestsUpdated) {
      localStorage.setItem("moneyRequests", JSON.stringify(moneyRequests));
    }
  } catch (error) {
    console.error("Data validation error:", error);
    // In case of corruption, we could implement recovery mechanisms here
  }
}

function initializeDashboard() {
  if (localStorage.getItem("userLoggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (document.getElementById("userDisplayName")) {
    document.getElementById("userDisplayName").textContent =
      currentUser.firstName;
  }

  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const userCustomers = customers.filter(
    (customer) => customer.userId === currentUser.id
  );

  if (userCustomers.length === 0) {
    alert(
      "No customer accounts found. Please create a customer account first."
    );
    window.location.href = "customer.html";
    return;
  }

  const selectedCustomerId = localStorage.getItem("selectedCustomerId");
  if (selectedCustomerId) {
    currentCustomer = userCustomers.find(
      (customer) => customer.id == selectedCustomerId
    );
  }

  if (!currentCustomer) {
    currentCustomer = userCustomers[0];
  }

  localStorage.setItem("selectedCustomerId", currentCustomer.id);

  loadCustomerDashboard();
  populateDashboardDropdownMain();
  loadPendingRequests();
}

function loadCustomerDashboard() {
  if (!currentCustomer) return;

  document.getElementById("customerName").textContent = currentCustomer.name;

  if (currentCustomer.personalDetails) {
    document.getElementById("profileFullName").textContent =
      currentCustomer.personalDetails.fullName || currentCustomer.name;
    document.getElementById("profileGuardianName").textContent =
      currentCustomer.personalDetails.guardianName || "N/A";
    document.getElementById("profileDOB").textContent =
      formatDate(currentCustomer.personalDetails.dateOfBirth) || "N/A";
    document.getElementById("profileGender").textContent =
      currentCustomer.personalDetails.gender || "N/A";
    document.getElementById("profileMaritalStatus").textContent =
      currentCustomer.personalDetails.maritalStatus || "N/A";
    document.getElementById("profileNationality").textContent =
      currentCustomer.personalDetails.nationality || "N/A";
    document.getElementById("profileOccupation").textContent =
      currentCustomer.personalDetails.occupation || "N/A";
    document.getElementById("profileResidentialStatus").textContent =
      currentCustomer.personalDetails.residentialStatus || "N/A";
  } else {
    document.getElementById("profileFullName").textContent =
      currentCustomer.name;
    document.getElementById("profileGuardianName").textContent = "N/A";
    document.getElementById("profileDOB").textContent = "N/A";
    document.getElementById("profileGender").textContent = "N/A";
    document.getElementById("profileMaritalStatus").textContent = "N/A";
    document.getElementById("profileNationality").textContent = "N/A";
    document.getElementById("profileOccupation").textContent = "N/A";
    document.getElementById("profileResidentialStatus").textContent = "N/A";
  }

  if (currentCustomer.contactDetails) {
    document.getElementById("profileMobile").textContent =
      currentCustomer.contactDetails.mobileNumber || currentCustomer.contact;
    document.getElementById("profileEmail").textContent =
      currentCustomer.contactDetails.emailAddress || currentCustomer.email;
    document.getElementById("profileLandline").textContent =
      currentCustomer.contactDetails.landline || "N/A";
    document.getElementById("profilePermanentAddress").textContent =
      currentCustomer.contactDetails.permanentAddress || "N/A";
    document.getElementById("profileCorrespondenceAddress").textContent =
      currentCustomer.contactDetails.correspondenceAddress || "N/A";
  } else {
    document.getElementById("profileMobile").textContent =
      currentCustomer.contact;
    document.getElementById("profileEmail").textContent = currentCustomer.email;
    document.getElementById("profileLandline").textContent = "N/A";
    document.getElementById("profilePermanentAddress").textContent = "N/A";
    document.getElementById("profileCorrespondenceAddress").textContent = "N/A";
  }

  if (currentCustomer.kycDetails) {
    if (document.getElementById("profileAadhaar")) {
      document.getElementById("profileAadhaar").textContent =
        maskAadhaar(currentCustomer.kycDetails.aadhaarNumber) || "N/A";
    }
    if (document.getElementById("profilePAN")) {
      document.getElementById("profilePAN").textContent =
        currentCustomer.kycDetails.panNumber || "N/A";
    }
  } else {
    if (document.getElementById("profileAadhaar")) {
      document.getElementById("profileAadhaar").textContent = "N/A";
    }
    if (document.getElementById("profilePAN")) {
      document.getElementById("profilePAN").textContent = "N/A";
    }
  }

  if (document.getElementById("profileAccountType")) {
    document.getElementById("profileAccountType").textContent =
      currentCustomer.accountType;
  }

  if (
    currentCustomer.accountDetails &&
    currentCustomer.accountDetails.initialDeposit
  ) {
    if (document.getElementById("profileInitialDeposit")) {
      document.getElementById("profileInitialDeposit").textContent =
        "₹" +
        new Intl.NumberFormat("en-IN").format(
          currentCustomer.accountDetails.initialDeposit
        );
    }
  } else {
    if (document.getElementById("profileInitialDeposit")) {
      document.getElementById("profileInitialDeposit").textContent = "₹1,000";
    }
  }

  if (!currentCustomer.accountNumber) {
    currentCustomer.accountNumber = generateAccountNumber();
    updateCustomerInStorage();
  }
  document.getElementById("accountNumber").textContent =
    currentCustomer.accountNumber;

  if (document.getElementById("profileAccountNumber")) {
    document.getElementById("profileAccountNumber").textContent =
      currentCustomer.accountNumber;
  }

  const memberSince = new Date(currentCustomer.dateAdded).toLocaleDateString();
  if (document.getElementById("profileMemberSince")) {
    document.getElementById("profileMemberSince").textContent = memberSince;
  }

  // Initialize balance only for new accounts (when balance is undefined/null, not when it's 0)
  if (
    currentCustomer.balance === undefined ||
    currentCustomer.balance === null
  ) {
    const initialDeposit = currentCustomer.accountDetails
      ? currentCustomer.accountDetails.initialDeposit
      : 1000;
    currentCustomer.balance = initialDeposit;

    // Initialize transactions array if it doesn't exist
    if (!currentCustomer.transactions) {
      currentCustomer.transactions = [];

      // Add initial deposit transaction for new accounts
      const initialTransaction = {
        id: Date.now(),
        type: "credit",
        amount: initialDeposit,
        description: "Initial Account Opening Deposit",
        date: new Date().toISOString(),
        remark: "Account opening balance",
      };
      currentCustomer.transactions.push(initialTransaction);
    }

    updateCustomerInStorage();
  }
  updateBalanceDisplay();

  loadTransactions();
  updateStats();

  document.getElementById("lastLogin").textContent =
    new Date().toLocaleString();
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN");
}

function maskAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.length !== 12) return "N/A";
  return "XXXX-XXXX-" + aadhaar.substr(-4);
}

function generateAccountNumber() {
  return (
    "4026" +
    Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0")
  );
}

function updateCustomerInStorage() {
  try {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const index = customers.findIndex((c) => c.id === currentCustomer.id);

    if (index !== -1) {
      // Validate data before storage
      if (typeof currentCustomer.balance !== "number") {
        currentCustomer.balance = parseFloat(currentCustomer.balance) || 0;
      }

      if (!Array.isArray(currentCustomer.transactions)) {
        currentCustomer.transactions = [];
      }

      // Update customer in array
      customers[index] = currentCustomer;

      // Create backup before writing
      const backupKey = `customers_backup_${Date.now()}`;
      const existingBackups = Object.keys(localStorage).filter((key) =>
        key.startsWith("customers_backup_")
      );

      // Keep only the last 3 backups to prevent storage overflow
      if (existingBackups.length >= 3) {
        existingBackups.sort();
        localStorage.removeItem(existingBackups[0]);
      }

      // Store backup
      localStorage.setItem(backupKey, JSON.stringify(customers));

      // Store main data
      localStorage.setItem("customers", JSON.stringify(customers));

      console.log(
        `Customer data updated and backed up at ${new Date().toISOString()}`
      );
    }
  } catch (error) {
    console.error("Failed to update customer data:", error);
    alert("Failed to save transaction. Please try again.");
    throw error; // Re-throw to handle in calling function
  }
}

function updateBalanceDisplay() {
  const formattedBalance = new Intl.NumberFormat("en-IN").format(
    currentCustomer.balance
  );
  document.getElementById("accountBalance").textContent = formattedBalance;
  if (document.getElementById("availableBalance")) {
    document.getElementById("availableBalance").textContent = formattedBalance;
  }
}

function loadTransactions() {
  if (!currentCustomer.transactions) {
    currentCustomer.transactions = [];
  }

  const transactionsList = document.getElementById("transactionsList");
  if (!transactionsList) return;

  const recentTransactions = currentCustomer.transactions.slice(-5).reverse();

  if (recentTransactions.length === 0) {
    transactionsList.innerHTML =
      '<div class="p-3 text-center text-muted">No transactions yet</div>';
    return;
  }

  transactionsList.innerHTML = recentTransactions
    .map((transaction) => {
      let accountInfo = "";
      if (transaction.recipientAccount) {
        accountInfo = `<br><small class="text-muted">To: ${transaction.recipientAccount}</small>`;
      } else if (transaction.senderAccount) {
        accountInfo = `<br><small class="text-muted">From: ${transaction.senderAccount}</small>`;
      }

      return `
        <div class="transaction-item">
            <div class="d-flex align-items-center">
                <div class="transaction-icon ${transaction.type}">
                    <i class="bi ${
                      transaction.type === "credit"
                        ? "bi-arrow-down-circle"
                        : "bi-arrow-up-circle"
                    }"></i>
                </div>
                <div>
                    <div class="fw-bold">${transaction.description}</div>
                    <small class="text-muted">${new Date(
                      transaction.date
                    ).toLocaleDateString()}</small>
                    ${accountInfo}
                    ${
                      transaction.remark
                        ? `<br><small class="text-info">${transaction.remark}</small>`
                        : ""
                    }
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${
                  transaction.type === "credit" ? "+" : "-"
                }₹${new Intl.NumberFormat("en-IN").format(transaction.amount)}
            </div>
        </div>
    `;
    })
    .join("");
}

function processSendMoney() {
  const recipientName = document.getElementById("recipientName").value;
  const recipientAccount = document.getElementById("recipientAccount").value;
  const amount = parseFloat(document.getElementById("sendAmount").value);
  const remark = document.getElementById("sendRemark").value;

  if (!recipientName || !recipientAccount || !amount) {
    alert("Please fill all required fields");
    return;
  }

  if (amount <= 0) {
    alert("Amount must be greater than zero");
    return;
  }

  if (amount > currentCustomer.balance) {
    alert("Insufficient balance");
    return;
  }

  // Start atomic transaction
  try {
    const allCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const recipientCustomer = allCustomers.find(
      (customer) => customer.accountNumber === recipientAccount
    );

    if (!recipientCustomer) {
      alert(
        "Recipient account number not found. Please check the account number."
      );
      return;
    }

    if (recipientCustomer.accountNumber === currentCustomer.accountNumber) {
      alert("Cannot send money to your own account.");
      return;
    }

    // Ensure transactions array exists for both accounts
    if (!currentCustomer.transactions) {
      currentCustomer.transactions = [];
    }
    if (!recipientCustomer.transactions) {
      recipientCustomer.transactions = [];
    }

    // Ensure balance exists and is a number for both accounts
    if (typeof currentCustomer.balance !== "number") {
      currentCustomer.balance = parseFloat(currentCustomer.balance) || 0;
    }
    if (typeof recipientCustomer.balance !== "number") {
      recipientCustomer.balance = parseFloat(recipientCustomer.balance) || 0;
    }

    // Double-check balance after ensuring it's a number
    if (amount > currentCustomer.balance) {
      alert("Insufficient balance");
      return;
    }

    // Generate unique transaction IDs
    const transactionTime = Date.now();
    const transactionId = `TXN${transactionTime}`;

    // Create transactions (atomically)
    const senderTransaction = {
      id: transactionId + "_DEBIT",
      type: "debit",
      amount: amount,
      description: `Sent to ${recipientName}`,
      recipientAccount: recipientAccount,
      recipientName: recipientName,
      remark: remark,
      date: new Date().toISOString(),
      status: "completed",
    };

    const recipientTransaction = {
      id: transactionId + "_CREDIT",
      type: "credit",
      amount: amount,
      description: `Received from ${currentCustomer.name}`,
      senderAccount: currentCustomer.accountNumber,
      senderName: currentCustomer.name,
      remark: remark,
      date: new Date().toISOString(),
      status: "completed",
    };

    // Execute the transfer atomically
    currentCustomer.balance = parseFloat(
      (currentCustomer.balance - amount).toFixed(2)
    );
    recipientCustomer.balance = parseFloat(
      (recipientCustomer.balance + amount).toFixed(2)
    );

    // Add transactions to both accounts
    currentCustomer.transactions.push(senderTransaction);
    recipientCustomer.transactions.push(recipientTransaction);

    // Update both customers in the array
    const senderIndex = allCustomers.findIndex(
      (c) => c.id === currentCustomer.id
    );
    const recipientIndex = allCustomers.findIndex(
      (c) => c.id === recipientCustomer.id
    );

    if (senderIndex !== -1) {
      allCustomers[senderIndex] = currentCustomer;
    }
    if (recipientIndex !== -1) {
      allCustomers[recipientIndex] = recipientCustomer;
    }

    // Commit transaction to storage (atomic operation)
    localStorage.setItem("customers", JSON.stringify(allCustomers));

    // Update UI
    updateBalanceDisplay();
    loadTransactions();
    updateStats();

    // Clear form and close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("sendMoneyModal")
    );
    if (modal) {
      modal.hide();
      document.getElementById("sendMoneyForm").reset();
    }

    alert(
      `Money sent successfully to ${recipientName}!\nTransaction ID: ${transactionId}`
    );
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed. Please try again.");
    // In a real system, we would roll back any partial changes here
  }
}

function processReceiveMoney() {
  const senderName = document.getElementById("senderName").value;
  const senderAccount = document.getElementById("senderAccount").value;
  const amount = parseFloat(document.getElementById("receiveAmount").value);
  const remark = document.getElementById("receiveRemark").value;

  if (!senderName || !senderAccount || !amount) {
    alert("Please fill all required fields including sender account number");
    return;
  }

  const allCustomers = JSON.parse(localStorage.getItem("customers")) || [];
  const senderCustomer = allCustomers.find(
    (customer) => customer.accountNumber === senderAccount
  );

  if (!senderCustomer) {
    alert("Sender account number not found. Please check the account number.");
    return;
  }

  if (senderCustomer.accountNumber === currentCustomer.accountNumber) {
    alert("Cannot request money from your own account.");
    return;
  }

  const moneyRequest = {
    id: Date.now(),
    requesterId: currentCustomer.id,
    requesterName: currentCustomer.name,
    requesterAccount: currentCustomer.accountNumber,
    senderId: senderCustomer.id,
    senderName: senderName,
    senderAccount: senderAccount,
    amount: amount,
    remark: remark,
    status: "pending",
    requestDate: new Date().toISOString(),
  };

  let moneyRequests = JSON.parse(localStorage.getItem("moneyRequests")) || [];
  moneyRequests.push(moneyRequest);
  localStorage.setItem("moneyRequests", JSON.stringify(moneyRequests));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("receiveMoneyModal")
  );
  if (modal) {
    modal.hide();
    document.getElementById("receiveMoneyForm").reset();
  }

  alert(
    `Money request sent to ${senderName}! They will need to approve this request.`
  );
  loadPendingRequests();
}

function updateStats() {
  const transactions = currentCustomer.transactions || [];
  const totalTransactions = transactions.length;

  if (document.getElementById("transactionCount")) {
    document.getElementById("transactionCount").textContent = totalTransactions;
  }

  if (document.getElementById("totalTransactions")) {
    document.getElementById("totalTransactions").textContent =
      totalTransactions;
  }

  const totalSent = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  if (document.getElementById("totalSent")) {
    document.getElementById("totalSent").textContent = new Intl.NumberFormat(
      "en-IN"
    ).format(totalSent);
  }
  if (document.getElementById("totalReceived")) {
    document.getElementById("totalReceived").textContent =
      new Intl.NumberFormat("en-IN").format(totalReceived);
  }
}

function loadAllTransactions() {
  alert("All transactions view - to be implemented");
}

function logout() {
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
const DashboardUtils = {
  formatCurrency: function (amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  },

  formatAmount: function (amount) {
    return new Intl.NumberFormat("en-IN").format(amount);
  },
  generateTransactionId: function () {
    return "TXN" + Date.now().toString().substr(-8);
  },

  validateAccountNumber: function (accountNumber) {
    const accountRegex = /^\d{12}$/;
    return accountRegex.test(accountNumber.replace(/\s/g, ""));
  },

  getTransactionIcon: function (type) {
    return type === "credit" ? "bi-arrow-down-circle" : "bi-arrow-up-circle";
  },

  getTransactionColor: function (type) {
    return type === "credit" ? "text-success" : "text-danger";
  },

  formatDate: function (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

const TransactionManager = {
  addTransaction: function (customerId, transactionData) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customerIndex = customers.findIndex((c) => c.id === customerId);

    if (customerIndex === -1) return false;

    if (!customers[customerIndex].transactions) {
      customers[customerIndex].transactions = [];
    }

    const transaction = {
      id: DashboardUtils.generateTransactionId(),
      ...transactionData,
      date: new Date().toISOString(),
    };

    customers[customerIndex].transactions.push(transaction);
    localStorage.setItem("customers", JSON.stringify(customers));

    return transaction;
  },

  getTransactions: function (customerId, limit = null) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customer = customers.find((c) => c.id === customerId);

    if (!customer || !customer.transactions) return [];

    const transactions = customer.transactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return limit ? transactions.slice(0, limit) : transactions;
  },

  getTransactionStats: function (customerId) {
    const transactions = this.getTransactions(customerId);

    return {
      total: transactions.length,
      totalCredit: transactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0),
      totalDebit: transactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0),
      thisMonth: transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const currentDate = new Date();
        return (
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      }).length,
    };
  },
};

const CustomerManager = {
  getCustomer: function (customerId) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    return customers.find((c) => c.id === parseInt(customerId));
  },

  updateCustomer: function (customerId, updates) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customerIndex = customers.findIndex(
      (c) => c.id === parseInt(customerId)
    );

    if (customerIndex === -1) return false;

    customers[customerIndex] = { ...customers[customerIndex], ...updates };
    localStorage.setItem("customers", JSON.stringify(customers));

    return customers[customerIndex];
  },

  initializeCustomerAccount: function (customerId) {
    const customer = this.getCustomer(customerId);
    if (!customer) return null;

    let updated = false;
    if (!customer.accountNumber) {
      customer.accountNumber = this.generateAccountNumber();
      updated = true;
    }

    if (!customer.transactions) {
      customer.transactions = [];
      updated = true;
    }

    if (updated) {
      this.updateCustomer(customerId, customer);
    }

    return customer;
  },

  generateAccountNumber: function () {
    return "4563" + Math.random().toString().substr(2, 8);
  },
};

const NotificationSystem = {
  showSuccess: function (message, duration = 3000) {
    this.showNotification(message, "success", duration);
  },

  showError: function (message, duration = 5000) {
    this.showNotification(message, "danger", duration);
  },

  showInfo: function (message, duration = 4000) {
    this.showNotification(message, "info", duration);
  },

  showNotification: function (message, type, duration) {
    const notificationHtml = `
            <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 9999; min-width: 300px;" 
                 role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", notificationHtml);

    setTimeout(() => {
      const notification = document.querySelector(".alert.position-fixed");
      if (notification) {
        notification.remove();
      }
    }, duration);
  },
};

window.DashboardUtils = DashboardUtils;
window.TransactionManager = TransactionManager;
window.CustomerManager = CustomerManager;
window.NotificationSystem = NotificationSystem;

// Data Recovery Utilities for ACID compliance
const DataRecoveryUtils = {
  recoverFromBackup: function () {
    try {
      const backupKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("customers_backup_")
      );

      if (backupKeys.length === 0) {
        alert("No backup data found");
        return false;
      }

      // Get the most recent backup
      backupKeys.sort();
      const latestBackupKey = backupKeys[backupKeys.length - 1];
      const backupData = localStorage.getItem(latestBackupKey);

      if (backupData) {
        localStorage.setItem("customers", backupData);
        alert("Data recovered from backup successfully!");
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error("Recovery failed:", error);
      alert("Failed to recover data from backup");
      return false;
    }
  },

  validateDataIntegrity: function () {
    try {
      const customers = JSON.parse(localStorage.getItem("customers")) || [];
      let issues = [];

      customers.forEach((customer, index) => {
        if (typeof customer.balance !== "number") {
          issues.push(
            `Customer ${customer.name} (ID: ${customer.id}): Invalid balance type`
          );
        }

        if (!Array.isArray(customer.transactions)) {
          issues.push(
            `Customer ${customer.name} (ID: ${customer.id}): Missing transactions array`
          );
        }

        if (!customer.accountNumber) {
          issues.push(
            `Customer ${customer.name} (ID: ${customer.id}): Missing account number`
          );
        }

        // Check transaction integrity
        if (customer.transactions) {
          const totalCredits = customer.transactions
            .filter((t) => t.type === "credit")
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

          const totalDebits = customer.transactions
            .filter((t) => t.type === "debit")
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

          const calculatedBalance = totalCredits - totalDebits;
          const actualBalance = parseFloat(customer.balance) || 0;

          if (Math.abs(calculatedBalance - actualBalance) > 0.01) {
            issues.push(
              `Customer ${customer.name} (ID: ${customer.id}): Balance mismatch - Calculated: ${calculatedBalance}, Actual: ${actualBalance}`
            );
          }
        }
      });

      if (issues.length > 0) {
        console.warn("Data integrity issues found:", issues);
        return { valid: false, issues: issues };
      } else {
        console.log("Data integrity check passed");
        return { valid: true, issues: [] };
      }
    } catch (error) {
      console.error("Data integrity check failed:", error);
      return { valid: false, issues: ["Failed to validate data integrity"] };
    }
  },

  exportData: function () {
    try {
      const data = {
        customers: JSON.parse(localStorage.getItem("customers")) || [],
        moneyRequests: JSON.parse(localStorage.getItem("moneyRequests")) || [],
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `banking_data_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      console.log("Data exported successfully");
    } catch (error) {
      console.error("Data export failed:", error);
      alert("Failed to export data");
    }
  },
};

// Make recovery utilities globally available for debugging
window.DataRecoveryUtils = DataRecoveryUtils;

let currentLookupType = null;

function showAccountLookup(type) {
  currentLookupType = type;

  const accountsList = document.getElementById("accountsList");
  accountsList.innerHTML = `
    <div class="list-group-item text-center text-muted">
      <i class="bi bi-search"></i> 
      <p class="mb-0">Enter a valid account number above to search for accounts</p>
    </div>
  `;

  // Clear the search input
  document.getElementById("accountSearchInput").value = "";

  const modal = new bootstrap.Modal(
    document.getElementById("accountLookupModal")
  );
  modal.show();
}

function selectAccount(accountNumber, customerName) {
  if (currentLookupType === "recipient") {
    document.getElementById("recipientAccount").value = accountNumber;
    document.getElementById("recipientName").value = customerName;
  } else if (currentLookupType === "sender") {
    document.getElementById("senderAccount").value = accountNumber;
    document.getElementById("senderName").value = customerName;
  }

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("accountLookupModal")
  );
  if (modal) {
    modal.hide();
  }
}

function filterAccounts() {
  const searchTerm = document.getElementById("accountSearchInput").value.trim();

  const accountsList = document.getElementById("accountsList");

  // If search term is empty, show the default message
  if (!searchTerm) {
    accountsList.innerHTML = `
      <div class="list-group-item text-center text-muted">
        <i class="bi bi-search"></i> 
        <p class="mb-0">Enter a valid account number above to search for accounts</p>
      </div>
    `;
    return;
  }

  // Check if the search term looks like an account number (contains digits)
  const hasDigits = /\d/.test(searchTerm);
  if (!hasDigits) {
    accountsList.innerHTML = `
      <div class="list-group-item text-center text-muted">
        <i class="bi bi-exclamation-triangle"></i> 
        <p class="mb-0">Please enter a valid account number</p>
      </div>
    `;
    return;
  }

  // Get all customers and filter them
  const allCustomers = JSON.parse(localStorage.getItem("customers")) || [];
  const otherCustomers = allCustomers.filter(
    (customer) => customer.accountNumber !== currentCustomer.accountNumber
  );

  // Search for accounts that match the search term
  const matchingCustomers = otherCustomers.filter((customer) => {
    return (
      customer.accountNumber && customer.accountNumber.includes(searchTerm)
    );
  });

  // Clear the accounts list
  accountsList.innerHTML = "";

  if (matchingCustomers.length === 0) {
    accountsList.innerHTML = `
      <div class="list-group-item text-center text-muted">
        <i class="bi bi-search"></i> 
        <p class="mb-0">No accounts found matching "${searchTerm}"</p>
        <small class="text-muted">Please check the account number and try again</small>
      </div>
    `;
  } else {
    matchingCustomers.forEach((customer) => {
      const accountItem = document.createElement("div");
      accountItem.className =
        "list-group-item list-group-item-action account-item";
      accountItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">${customer.name}</h6>
            <p class="mb-1 text-muted">Account: ${customer.accountNumber}</p>
            <small class="text-muted">${customer.accountType} Account</small>
          </div>
          <button class="btn btn-primary btn-sm" onclick="selectAccount('${customer.accountNumber}', '${customer.name}')">
            Select
          </button>
        </div>
      `;
      accountsList.appendChild(accountItem);
    });
  }
}

function loadPendingRequests() {
  const moneyRequests = JSON.parse(localStorage.getItem("moneyRequests")) || [];

  const sentRequests = moneyRequests.filter(
    (request) => request.requesterId === currentCustomer.id
  );

  const receivedRequests = moneyRequests.filter(
    (request) =>
      request.senderId === currentCustomer.id && request.status === "pending"
  );

  loadSentRequests(sentRequests);
  loadReceivedRequests(receivedRequests);
}

function loadSentRequests(requests) {
  const sentRequestsList = document.getElementById("sentRequestsList");
  if (!sentRequestsList) return;

  if (requests.length === 0) {
    sentRequestsList.innerHTML =
      '<p class="text-muted small">No requests sent</p>';
    return;
  }

  sentRequestsList.innerHTML = requests
    .slice(-3)
    .reverse()
    .map(
      (request) => `
    <div class="request-item mb-3 p-3 border rounded">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h6 class="mb-1">₹${new Intl.NumberFormat("en-IN").format(
            request.amount
          )}</h6>
          <p class="mb-1 small text-muted">From: ${request.senderName}</p>
          <p class="mb-1 small text-muted">Status: <span class="badge ${getStatusBadgeClass(
            request.status
          )}">${request.status}</span></p>
          ${
            request.remark
              ? `<p class="mb-0 small"><em>"${request.remark}"</em></p>`
              : ""
          }
        </div>
        <small class="text-muted">${new Date(
          request.requestDate
        ).toLocaleDateString()}</small>
      </div>
    </div>
  `
    )
    .join("");
}

function loadReceivedRequests(requests) {
  const receivedRequestsList = document.getElementById("receivedRequestsList");
  if (!receivedRequestsList) return;

  if (requests.length === 0) {
    receivedRequestsList.innerHTML =
      '<p class="text-muted small">No pending requests</p>';
    return;
  }

  receivedRequestsList.innerHTML = requests
    .slice(-3)
    .reverse()
    .map(
      (request) => `
    <div class="request-item mb-3 p-3 border rounded">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 class="mb-1">₹${new Intl.NumberFormat("en-IN").format(
            request.amount
          )}</h6>
          <p class="mb-1 small text-muted">From: ${request.requesterName}</p>
          ${
            request.remark
              ? `<p class="mb-0 small"><em>"${request.remark}"</em></p>`
              : ""
          }
        </div>
        <small class="text-muted">${new Date(
          request.requestDate
        ).toLocaleDateString()}</small>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-success btn-sm" onclick="approveRequest('${
          request.id
        }')">
          <i class="bi bi-check-circle"></i> Approve
        </button>
        <button class="btn btn-danger btn-sm" onclick="rejectRequest('${
          request.id
        }')">
          <i class="bi bi-x-circle"></i> Reject
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "pending":
      return "bg-warning text-dark";
    case "approved":
      return "bg-success";
    case "rejected":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

function approveRequest(requestId) {
  try {
    const moneyRequests =
      JSON.parse(localStorage.getItem("moneyRequests")) || [];
    const request = moneyRequests.find((req) => req.id == requestId);

    if (!request) {
      alert("Request not found");
      return;
    }

    if (request.status !== "pending") {
      alert("Request has already been processed");
      return;
    }

    const amount = parseFloat(request.amount);
    if (amount <= 0) {
      alert("Invalid request amount");
      return;
    }

    // Ensure balance is a number
    if (typeof currentCustomer.balance !== "number") {
      currentCustomer.balance = parseFloat(currentCustomer.balance) || 0;
    }

    if (amount > currentCustomer.balance) {
      alert("Insufficient balance to approve this request");
      return;
    }

    const allCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const requesterCustomer = allCustomers.find(
      (customer) => customer.id === request.requesterId
    );

    if (!requesterCustomer) {
      alert("Requester account not found");
      return;
    }

    // Ensure transactions array exists for both accounts
    if (!currentCustomer.transactions) {
      currentCustomer.transactions = [];
    }
    if (!requesterCustomer.transactions) {
      requesterCustomer.transactions = [];
    }

    // Ensure requester balance is a number
    if (typeof requesterCustomer.balance !== "number") {
      requesterCustomer.balance = parseFloat(requesterCustomer.balance) || 0;
    }

    // Generate unique transaction IDs
    const transactionTime = Date.now();
    const transactionId = `REQ${requestId}_${transactionTime}`;

    // Create transactions atomically
    const senderTransaction = {
      id: transactionId + "_DEBIT",
      type: "debit",
      amount: amount,
      description: `Sent to ${request.requesterName} (Request Approved)`,
      recipientAccount: request.requesterAccount,
      recipientName: request.requesterName,
      remark: request.remark,
      date: new Date().toISOString(),
      status: "completed",
      requestId: requestId,
    };

    const receiverTransaction = {
      id: transactionId + "_CREDIT",
      type: "credit",
      amount: amount,
      description: `Received from ${currentCustomer.name} (Request Approved)`,
      senderAccount: currentCustomer.accountNumber,
      senderName: currentCustomer.name,
      remark: request.remark,
      date: new Date().toISOString(),
      status: "completed",
      requestId: requestId,
    };

    // Execute the transfer atomically
    currentCustomer.balance = parseFloat(
      (currentCustomer.balance - amount).toFixed(2)
    );
    requesterCustomer.balance = parseFloat(
      (requesterCustomer.balance + amount).toFixed(2)
    );

    // Add transactions to both accounts
    currentCustomer.transactions.push(senderTransaction);
    requesterCustomer.transactions.push(receiverTransaction);

    // Update request status
    request.status = "approved";
    request.approvalDate = new Date().toISOString();
    request.transactionId = transactionId;

    // Update both customers in the array
    const senderIndex = allCustomers.findIndex(
      (c) => c.id === currentCustomer.id
    );
    const requesterIndex = allCustomers.findIndex(
      (c) => c.id === requesterCustomer.id
    );

    if (senderIndex !== -1) {
      allCustomers[senderIndex] = currentCustomer;
    }
    if (requesterIndex !== -1) {
      allCustomers[requesterIndex] = requesterCustomer;
    }

    // Commit all changes atomically
    localStorage.setItem("customers", JSON.stringify(allCustomers));
    localStorage.setItem("moneyRequests", JSON.stringify(moneyRequests));

    // Update UI
    updateBalanceDisplay();
    loadTransactions();
    updateStats();
    loadPendingRequests();

    alert(
      `Request approved! ₹${new Intl.NumberFormat("en-IN").format(
        amount
      )} sent to ${request.requesterName}\nTransaction ID: ${transactionId}`
    );
  } catch (error) {
    console.error("Request approval failed:", error);
    alert("Failed to approve request. Please try again.");
    // In a real system, we would roll back any partial changes here
  }
}

function rejectRequest(requestId) {
  const moneyRequests = JSON.parse(localStorage.getItem("moneyRequests")) || [];
  const request = moneyRequests.find((req) => req.id == requestId);

  if (!request) {
    alert("Request not found");
    return;
  }

  request.status = "rejected";
  request.rejectionDate = new Date().toISOString();

  localStorage.setItem("moneyRequests", JSON.stringify(moneyRequests));
  loadPendingRequests();

  alert(`Request from ${request.requesterName} has been rejected`);
}

function editPersonalInfo() {
  if (!currentCustomer.personalDetails) {
    currentCustomer.personalDetails = {};
  }

  const modal = new bootstrap.Modal(
    document.getElementById("editPersonalInfoModal")
  );

  document.getElementById("editFullName").value =
    currentCustomer.personalDetails.fullName || currentCustomer.name || "";
  document.getElementById("editGuardianName").value =
    currentCustomer.personalDetails.guardianName || "";
  document.getElementById("editDOB").value =
    currentCustomer.personalDetails.dateOfBirth || "";
  document.getElementById("editGender").value =
    currentCustomer.personalDetails.gender || "";
  document.getElementById("editMaritalStatus").value =
    currentCustomer.personalDetails.maritalStatus || "";
  document.getElementById("editNationality").value =
    currentCustomer.personalDetails.nationality || "";
  document.getElementById("editOccupation").value =
    currentCustomer.personalDetails.occupation || "";
  document.getElementById("editResidentialStatus").value =
    currentCustomer.personalDetails.residentialStatus || "";

  modal.show();
}

function savePersonalInfo() {
  if (!currentCustomer.personalDetails) {
    currentCustomer.personalDetails = {};
  }

  currentCustomer.personalDetails.fullName =
    document.getElementById("editFullName").value;
  currentCustomer.personalDetails.guardianName =
    document.getElementById("editGuardianName").value;
  currentCustomer.personalDetails.dateOfBirth =
    document.getElementById("editDOB").value;
  currentCustomer.personalDetails.gender =
    document.getElementById("editGender").value;
  currentCustomer.personalDetails.maritalStatus =
    document.getElementById("editMaritalStatus").value;
  currentCustomer.personalDetails.nationality =
    document.getElementById("editNationality").value;
  currentCustomer.personalDetails.occupation =
    document.getElementById("editOccupation").value;
  currentCustomer.personalDetails.residentialStatus = document.getElementById(
    "editResidentialStatus"
  ).value;

  currentCustomer.name = currentCustomer.personalDetails.fullName;

  updateCustomerInStorage();
  loadCustomerDashboard();

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("editPersonalInfoModal")
  );
  if (modal) {
    modal.hide();
  }

  alert("Personal information updated successfully!");
}

function editContactInfo() {
  if (!currentCustomer.contactDetails) {
    currentCustomer.contactDetails = {};
  }

  const modal = new bootstrap.Modal(
    document.getElementById("editContactInfoModal")
  );

  document.getElementById("editMobile").value =
    currentCustomer.contactDetails.mobileNumber ||
    currentCustomer.contact ||
    "";
  document.getElementById("editEmail").value =
    currentCustomer.contactDetails.emailAddress || currentCustomer.email || "";
  document.getElementById("editLandline").value =
    currentCustomer.contactDetails.landline || "";
  document.getElementById("editPermanentAddress").value =
    currentCustomer.contactDetails.permanentAddress || "";
  document.getElementById("editCorrespondenceAddress").value =
    currentCustomer.contactDetails.correspondenceAddress || "";

  const checkbox = document.getElementById("editSameAsPermananent");
  checkbox.addEventListener("change", function () {
    const correspondenceAddress = document.getElementById(
      "editCorrespondenceAddress"
    );
    if (this.checked) {
      correspondenceAddress.value = document.getElementById(
        "editPermanentAddress"
      ).value;
    } else {
      correspondenceAddress.value = "";
    }
  });

  document
    .getElementById("editPermanentAddress")
    .addEventListener("input", function () {
      const checkbox = document.getElementById("editSameAsPermananent");
      if (checkbox.checked) {
        document.getElementById("editCorrespondenceAddress").value = this.value;
      }
    });

  modal.show();
}

function saveContactInfo() {
  if (!currentCustomer.contactDetails) {
    currentCustomer.contactDetails = {};
  }

  currentCustomer.contactDetails.mobileNumber =
    document.getElementById("editMobile").value;
  currentCustomer.contactDetails.emailAddress =
    document.getElementById("editEmail").value;
  currentCustomer.contactDetails.landline =
    document.getElementById("editLandline").value;
  currentCustomer.contactDetails.permanentAddress = document.getElementById(
    "editPermanentAddress"
  ).value;
  currentCustomer.contactDetails.correspondenceAddress =
    document.getElementById("editCorrespondenceAddress").value ||
    document.getElementById("editPermanentAddress").value;

  currentCustomer.contact = currentCustomer.contactDetails.mobileNumber;
  currentCustomer.email = currentCustomer.contactDetails.emailAddress;

  updateCustomerInStorage();
  loadCustomerDashboard();

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("editContactInfoModal")
  );
  if (modal) {
    modal.hide();
  }

  alert("Contact information updated successfully!");
}

function populateDashboardDropdownMain() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const userCustomers = customers.filter(
    (customer) => customer.userId === currentUser.id
  );

  const dropdown = document.getElementById("dashboardDropdownMain");
  const noDashboards = document.getElementById("noDashboardsMain");

  if (!dropdown) return;

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
      link.onclick = () => navigateToDashboardMain(customer.id);

      const accountTypeIcon = getDashboardAccountTypeIcon(customer.accountType);
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

function getDashboardAccountTypeIcon(accountType) {
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

function navigateToDashboardMain(customerId) {
  localStorage.setItem("selectedCustomerId", customerId);
  window.location.reload();
}
