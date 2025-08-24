import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Navbar, Table } from "react-bootstrap";
import {
  FaTrash,
  FaSearch,
  FaFolder,
  FaUserMinus,
  FaUser,
} from "react-icons/fa";
import "./AdminDashboard.css";
import Permission from "./permission";
import AddGroups from "./AddGroups";

const initialEmployees = [];

function AdminDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [emp, setEmp] = useState(initialEmployees);
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [activeView, setActiveView] = useState("users");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(emp.map((i) => i.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectrow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const removeUser = (id) => {
    setEmp(emp.filter((i) => i.id !== id));
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  };

  const isSelectAll = selectedRows.length === emp.length;

  const uniqueGroups = groups.map((g) => g.name);

  useEffect(() => {
    let storedGroups = [];
    try {
      storedGroups = JSON.parse(localStorage.getItem("groups") || "null") || [];
    } catch {
      storedGroups = [];
    }
    if (storedGroups.length) {
      storedGroups = storedGroups.filter((g) => {
        const n = (g.name || "").toLowerCase();
        return n !== "general" && n !== "unassigned";
      });
    }
    if (!storedGroups.length) {
      storedGroups = [
        { id: 1, name: "HR", users: 0 },
        { id: 2, name: "IT", users: 0 },
        { id: 3, name: "Finance", users: 0 },
        { id: 4, name: "Marketing", users: 0 },
      ];
    }
    try {
      const rawAccounts = localStorage.getItem("signedUpAccounts");
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
      const rows = [];
      const counts = {};
      const allowed = new Set(["HR", "IT", "Finance", "Marketing"]);
      accounts.forEach((acc, idx) => {
        const email = acc.email;
        let details = {};
        try {
          details =
            JSON.parse(
              localStorage.getItem(`employeeDetails_${email}`) || "null"
            ) || {};
        } catch {
          details = {};
        }
        const fullName =
          `${details.firstName || ""} ${details.lastName || ""}`.trim() ||
          email;
        let dept = details.department;
        if (!dept || !allowed.has(dept)) {
          return;
        }
        rows.push({
          id: details.employeeId || idx + 1,
          name: fullName,
          group: dept,
          email,
        });
        counts[dept] = (counts[dept] || 0) + 1;
      });
      let updatedGroups = [...storedGroups];
      Object.entries(counts).forEach(([dept, cnt]) => {
        const gi = updatedGroups.findIndex((g) => g.name === dept);
        if (gi === -1) {
          updatedGroups.push({
            id: updatedGroups.length
              ? Math.max(...updatedGroups.map((g) => g.id)) + 1
              : 1,
            name: dept,
            users: cnt,
          });
        } else {
          updatedGroups[gi] = { ...updatedGroups[gi], users: cnt };
        }
      });
      setEmp(rows);
      setGroups(updatedGroups);
      try {
        localStorage.setItem("groups", JSON.stringify(updatedGroups));
      } catch (_) {}
    } catch {
      setEmp([]);
      setGroups(storedGroups);
    }
  }, []);

  const handleGroupsChange = (updated) => {
    setGroups(updated);
  };

  const filteredData = emp.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) &&
      (selectedGroup === "" || i.group === selectedGroup)
  );

  return (
    <div className="main-bg">
      <div className="header container-fluid py-2 d-flex justify-content-between align-items-center">
        <div className="navbar-left d-flex align-items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_(2021).svg"
            alt="logo"
            className="navbar-logo-profile img-fluid"
          />
        </div>
        <div
          className="navbar-right d-flex align-items-center ms-auto"
          style={{ gap: "32px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0074EB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell-icon lucide-bell"
          >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
          <div style={{ position: "relative" }} ref={profileDropdownRef}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0074EB"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
              onClick={() => setShowProfileDropdown((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              <path d="M18 20a6 6 0 0 0-12 0" />
              <circle cx="12" cy="10" r="4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            {showProfileDropdown && (
              <div className="profile-dropdown" style={{ right: 0 }}>
                <div
                  className="profile-item"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/adminProfile");
                  }}
                >
                  Profile
                </div>
                <div
                  className="profile-item"
                  onClick={() => {
                    localStorage.removeItem("loginEmail");
                    localStorage.removeItem("isAdmin");
                    navigate("/login");
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div
          className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <div
            className={`sidebar-item ${activeView === "users" ? "active" : ""}`}
            title="Dashboard"
            onClick={() => setActiveView("users")}
            aria-label="Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"
            >
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            {sidebarExpanded && (
              <span className="sidebar-label">Dashboard</span>
            )}
          </div>
          <div
            className={`sidebar-item ${
              activeView === "groups" ? "active" : ""
            }`}
            title="Add Groups"
            onClick={() => setActiveView("groups")}
            aria-label="Add Groups"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users-round-icon lucide-users-round"
            >
              <path d="M18 21a8 8 0 0 0-16 0" />
              <circle cx="10" cy="8" r="5" />
              <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
            </svg>
            {sidebarExpanded && (
              <span className="sidebar-label">Add Groups</span>
            )}
          </div>
        </div>

        <div className="content-area">
          {activeView === "users" && (
            <>
              <div
                className="search-filter-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="search-left"
                  style={{
                    position: "relative",
                    width: "280px",
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      paddingLeft: "35px",
                      width: "100%",
                      height: "35px",
                      borderRadius: "5px",
                      border: "1px solid #0d6efd",
                    }}
                  />
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                  />
                </div>

                <div
                  className="filters-right"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginLeft: "auto",
                  }}
                >
                  <Dropdown className="group-dropdown">
                    <Dropdown.Toggle variant="btn-primary">
                      {selectedGroup === "" ? "All Groups" : selectedGroup}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setSelectedGroup("")}>
                        All Groups
                      </Dropdown.Item>
                      {uniqueGroups.map((g, idx) => (
                        <Dropdown.Item
                          key={idx}
                          onClick={() => setSelectedGroup(g)}
                        >
                          {g}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setEmp(emp.filter((i) => !selectedRows.includes(i.id)));
                      setSelectedRows([]);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>

              <Table bordered hover className="employee-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Employee Id</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Profile</th>
                    <th>Permission</th>
                    <th>Remove User</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(i.id)}
                          onChange={() => handleSelectrow(i.id)}
                        />
                      </td>
                      <td>{i.id}</td>
                      <td>{i.name}</td>
                      <td>{i.group}</td>
                      <td>
                        <FaUser
                          style={{ color: "black", cursor: "pointer" }}
                          title="View Profile"
                          onClick={() => setPreviewUser(i)}
                        />
                      </td>
                      <td>
                        <Permission email={i.email} employeeId={i.id} />
                      </td>
                      <td>
                        <FaUserMinus
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => removeUser(i.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {activeView === "groups" && (
            <AddGroups
              embedded
              groupsData={groups}
              onGroupsChange={handleGroupsChange}
            />
          )}
        </div>
      </div>
      {previewUser && (
        <div
          className="profile-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("profile-modal-overlay")) {
              setPreviewUser(null);
            }
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1500,
          }}
        >
          <div
            className="profile-modal"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px 28px",
              width: "min(460px, 90%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              position: "relative",
              fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <button
              onClick={() => setPreviewUser(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "#1976d2",
                color: "#fff",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "1rem", color: "#1976d2" }}>
              Employee Profile
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <strong>Name:</strong> {previewUser.name}
              </div>
              <div>
                <strong>Employee Id:</strong> {previewUser.id}
              </div>
              <div>
                <strong>Department / Group:</strong> {previewUser.group}
              </div>
              {previewUser.email && (
                <div>
                  <strong>Email:</strong> {previewUser.email}
                </div>
              )}
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
              <button
                onClick={() => setPreviewUser(null)}
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
            <p style={{ fontSize: "0.7rem", marginTop: "1rem", color: "#666" }}>
              (Click anywhere outside this box to close)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
