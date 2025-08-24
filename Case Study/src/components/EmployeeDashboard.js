import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import { FaSearch, FaStar, FaEye, FaDownload } from "react-icons/fa";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./EmployeeDashboard.css";
import { useNavigate } from "react-router-dom";

const empData = [
  {
    id: 1,
    title: "Report File 1",
    type: "PDF",
    date: "17/08/2025",
    size: "2.2MB",
    fileUrl: "/files/report1.pdf",
  },
  {
    id: 2,
    title: "Report File 2",
    type: "CSV",
    date: "16/08/2025",
    size: "1.5MB",
    fileUrl: "/files/report2.csv",
  },
  {
    id: 3,
    title: "Report File 3",
    type: "PDF",
    date: "15/08/2025",
    size: "3.1MB",
    fileUrl: "/files/report3.pdf",
  },
  {
    id: 4,
    title: "Invoice File",
    type: "XLSX",
    date: "14/08/2024",
    size: "4.5MB",
    fileUrl: "/files/invoice.xlsx",
  },
  {
    id: 5,
    title: "Analysis File",
    type: "CSV",
    date: "13/08/2023",
    size: "2.9MB",
    fileUrl: "/files/analysis.csv",
  },
  {
    id: 6,
    title: "Summary Report",
    type: "PDF",
    date: "11/07/2023",
    size: "3.8MB",
    fileUrl: "/files/summary.pdf",
  },
  {
    id: 7,
    title: "Financial Data",
    type: "XLSX",
    date: "21/05/2022",
    size: "5.4MB",
    fileUrl: "/files/financial.xlsx",
  },
  {
    id: 8,
    title: "Market Insights",
    type: "CSV",
    date: "01/01/2024",
    size: "2.1MB",
    fileUrl: "/files/market.csv",
  },
  {
    id: 9,
    title: "Sales Report",
    type: "PDF",
    date: "25/12/2023",
    size: "3.6MB",
    fileUrl: "/files/sales.pdf",
  },
  {
    id: 10,
    title: "Budget File",
    type: "XLSX",
    date: "02/03/2022",
    size: "4.8MB",
    fileUrl: "/files/budget.xlsx",
  },
  {
    id: 11,
    title: "Summary Report",
    type: "PDF",
    date: "11/07/2023",
    size: "3.8MB",
    fileUrl: "/files/summary.pdf",
  },
  {
    id: 12,
    title: "Financial Data",
    type: "XLSX",
    date: "21/05/2022",
    size: "5.4MB",
    fileUrl: "/files/financial.xlsx",
  },
  {
    id: 13,
    title: "Market Insights",
    type: "CSV",
    date: "01/01/2024",
    size: "2.1MB",
    fileUrl: "/files/market.csv",
  },
  {
    id: 14,
    title: "Sales Report",
    type: "PDF",
    date: "25/12/2023",
    size: "3.6MB",
    fileUrl: "/files/sales.pdf",
  },
  {
    id: 15,
    title: "Budget File",
    type: "XLSX",
    date: "02/03/2022",
    size: "4.8MB",
    fileUrl: "/files/budget.xlsx",
  },
];

function EmployeeDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [emp, setEmp] = useState(empData);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginEmail");
    navigate("/login");
  };

  const handleProfilePage = () => {
    navigate("/employeeProfile");
  };

  useEffect(() => {
    const email = localStorage.getItem("loginEmail");
    if (!email) {
      setPermissionGranted(false);
      return;
    }
    try {
      const raw = localStorage.getItem(`perm_${email}`);
      if (raw === null) {
        setPermissionGranted(true);
      } else {
        setPermissionGranted(raw === "1");
      }
    } catch {
      setPermissionGranted(false);
    }
  }, []);

  const sidebarItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      ),
      onClick: () => {
        setShowFavourites(false);
        setShowRecentlyViewed(false);
      },
    },
    {
      id: "recent",
      name: "Recently Accessed",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file-clock-icon lucide-file-clock"
        >
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
          <path d="M8 14v2.2l1.6 1" />
          <circle cx="8" cy="16" r="6" />
        </svg>
      ),
      onClick: () => {
        setShowRecentlyViewed(!showRecentlyViewed);
        setShowFavourites(false);
      },
    },
    {
      id: "favorites",
      name: "Favorites",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-star-icon lucide-star"
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ),
      onClick: () => {
        setShowFavourites(!showFavourites);
        setShowRecentlyViewed(false);
      },
    },
  ];

  const activeKey = showRecentlyViewed
    ? "recent"
    : showFavourites
    ? "favorites"
    : "dashboard";

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(emp.map((i) => i.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const isSelectAll = selectedRows.length === emp.length;

  const parseDmy = (dmy) => {
    const [d, m, y] = dmy.split("/").map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  };
  const parseIsoLocal = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  };

  const filteredData = permissionGranted
    ? emp.filter((i) => {
        const search = query.toLowerCase();
        const id3 = String(i.id).padStart(3, "0");
        const matchesSearch =
          i.title.toLowerCase().includes(search) ||
          i.type.toLowerCase().includes(search) ||
          i.date.toLowerCase().includes(search) ||
          id3.includes(search);

        const matchesType = filterType ? i.type === filterType : true;

        const itemDate = parseDmy(i.date);
        const fromDate = dateFrom ? parseIsoLocal(dateFrom) : null;
        const toDate = dateTo ? parseIsoLocal(dateTo) : null;
        const toDateEnd = toDate
          ? new Date(
              toDate.getFullYear(),
              toDate.getMonth(),
              toDate.getDate(),
              23,
              59,
              59,
              999
            )
          : null;

        if (dateFrom || dateTo) {
          console.log("Filtering file:", i.title, "Date:", i.date);
          console.log("Parsed item date:", itemDate);
          console.log("From date:", fromDate);
          console.log("To date end:", toDateEnd);
        }

        const fromOk = fromDate
          ? itemDate.getTime() >= fromDate.getTime()
          : true;
        const toOk = toDateEnd
          ? itemDate.getTime() <= toDateEnd.getTime()
          : true;

        if (dateFrom || dateTo) {
          console.log("From OK:", fromOk, "To OK:", toOk);
        }

        const matchesFavourites = showFavourites
          ? favourites.includes(i.id)
          : true;
        const matchesRecentlyViewed = showRecentlyViewed
          ? recentlyViewed.includes(i.id)
          : true;

        return (
          matchesSearch &&
          matchesType &&
          fromOk &&
          toOk &&
          matchesFavourites &&
          matchesRecentlyViewed
        );
      })
    : [];

  const handleExportAll = async () => {
    const zip = new JSZip();
    for (const file of emp) {
      const response = await fetch(file.fileUrl);
      if (file.fileUrl) {
        const blob = await response.blob();
        zip.file(file.title + "." + file.type.toLowerCase(), blob);
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "All_Files.zip");
  };

  const handleDownload = async (file) => {
    const response = await fetch(file.fileUrl);
    const blob = await response.blob();
    saveAs(blob, `${file.title}.${file.type.toLowerCase()}`);
  };

  const handlePreview = (file) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, "_blank");
      if (!recentlyViewed.includes(file.id)) {
        setRecentlyViewed([file.id, ...recentlyViewed]);
      }
    }
  };

  return (
    <div className="main-bg">
      <div className="header container-fluid py-2 d-flex justify-content-between align-items-center">
        <div className="navbar-left d-flex align-items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_%282021%29.svg"
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
          <div style={{ position: "relative" }}>
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
            </svg>
            {showProfileDropdown && (
              <div className="profile-dropdown" ref={profileDropdownRef}>
                <div className="profile-item" onClick={handleProfilePage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-id-card-icon lucide-id-card"
                  >
                    <path d="M16 10h2" />
                    <path d="M16 14h2" />
                    <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                    <circle cx="9" cy="11" r="2" />
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                  </svg>
                  Profile Page
                </div>
                <div className="profile-item" onClick={handleLogout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-log-out-icon lucide-log-out"
                  >
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div
          className={`sidebar${sidebarExpanded ? " expanded" : ""}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {sidebarItems.map((item) => (
            <div
              key={item.name}
              className={`icon-wrapper sidebar-item${
                activeKey === item.id ? " active" : ""
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                item.onClick();
                setSidebarExpanded(false);
              }}
            >
              {item.icon}
              {sidebarExpanded && (
                <span className="sidebar-label">{item.name}</span>
              )}
            </div>
          ))}
        </div>

        <div className="content-area">
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
              style={{ position: "relative", width: "280px", flexShrink: 0 }}
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
              <select
                className="filter-btn"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
                <option value="XLSX">XLSX</option>
              </select>

              <div className="daterange-toggle" ref={dateRangeRef}>
                <button
                  type="button"
                  className="filter-btn"
                  onClick={() => setShowDatePicker((v) => !v)}
                >
                  {dateFrom || dateTo
                    ? `${dateFrom || "…"} → ${dateTo || "…"}`
                    : "Date Range"}
                </button>
                {showDatePicker && (
                  <div
                    className="daterange-popover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="dr-row">
                      <label>From</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="dr-row">
                      <label>To</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                    <div className="dr-actions">
                      <button
                        type="button"
                        className="filter-btn"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        className="filter-btn"
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                          setShowDatePicker(false);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="filter-btn" onClick={handleExportAll}>
                Export
              </button>
            </div>
          </div>

          {!permissionGranted && (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#b00",
                fontWeight: 600,
              }}
            >
              Access locked by administrator. You do not have permission to view
              reports.
            </div>
          )}
          <div
            className="table-scroll"
            style={
              !permissionGranted
                ? {
                    filter: "blur(4px)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }
                : {}
            }
          >
            <Table bordered hover className="employee-table">
              <thead>
                <tr style={{ backgroundColor: "lightblue" }}>
                  <th>
                    <input
                      type="checkbox"
                      checked={isSelectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Download</th>
                  <th>Favourites</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(i.id)}
                        onChange={() => handleSelectRow(i.id)}
                      />
                    </td>
                    <td>{String(i.id).padStart(3, "0")}</td>
                    <td>{i.title}</td>
                    <td>{i.type}</td>
                    <td>{i.date}</td>
                    <td>{i.size}</td>
                    <td>
                      <FaDownload
                        className="icon-hover-blue"
                        style={{ color: "black", cursor: "pointer" }}
                        onClick={() => handleDownload(i)}
                      />
                    </td>
                    <td>
                      <FaStar
                        className="icon-hover-green"
                        style={{
                          color: favourites.includes(i.id) ? "gold" : "gray",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (favourites.includes(i.id)) {
                            setFavourites(
                              favourites.filter((favId) => favId !== i.id)
                            );
                          } else {
                            setFavourites([...favourites, i.id]);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <FaEye
                        className="icon-hover-blue"
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handlePreview(i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
