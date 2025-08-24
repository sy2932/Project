import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaUserCircle,
  FaUsers,
  FaThLarge,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import "./AddGroups.css";

function AddGroups({ embedded = false, groupsData, onGroupsChange }) {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [newGroup, setNewGroup] = useState("");
  const [showForm, setShowForm] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (
        showForm &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setShowForm(false);
      }
    };
    if (showForm) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showForm]);

  useEffect(() => {
    if (groupsData) {
      const cleaned = groupsData.filter((g) => {
        const n = g.name.toLowerCase();
        return n !== "general" && n !== "unassigned";
      });
      setGroups(cleaned);
      return;
    }
    const stored = localStorage.getItem("groups");
    if (stored) {
      try {
        let parsed = JSON.parse(stored) || [];
        parsed = parsed.filter(
          (g) =>
            g.name && !["general", "unassigned"].includes(g.name.toLowerCase())
        );
        localStorage.setItem("groups", JSON.stringify(parsed));
        setGroups(parsed);
        if (parsed.length) return;
      } catch (_) {}
    }
    const defaultGroups = [
      { id: 1, name: "HR", users: 0 },
      { id: 2, name: "IT", users: 0 },
      { id: 3, name: "Finance", users: 0 },
      { id: 4, name: "Marketing", users: 0 },
    ];
    localStorage.setItem("groups", JSON.stringify(defaultGroups));
    setGroups(defaultGroups);
  }, [groupsData]);

  const handleAddGroup = () => {
    if (newGroup.trim() === "") return;
    const trimmed = newGroup.trim();
    if (trimmed.toLowerCase() === "general") {
      setNewGroup("");
      setShowForm(false);
      return;
    }
    if (groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewGroup("");
      setShowForm(false);
      return;
    }
    const newEntry = {
      id: groups.length ? Math.max(...groups.map((g) => g.id)) + 1 : 1,
      name: trimmed,
      users: 0,
    };
    const updated = [...groups, newEntry];
    setGroups(updated);
    try {
      localStorage.setItem("groups", JSON.stringify(updated));
    } catch (_) {}
    if (onGroupsChange) onGroupsChange(updated);
    setNewGroup("");
    setShowForm(false);
  };

  const workspace = (
    <div className={embedded ? "groups-embed" : "workspace"}>
      <div className="workspace-header">
        <h2>Create Groups</h2>
      </div>
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
            placeholder="Search Group"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <button
            className="delete-btn"
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              padding: "8px 14px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete <FaTrash style={{ color: "red", marginLeft: 6 }} />
          </button>
        </div>
      </div>
      <table className="group-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" style={{ color: "blue" }} />
            </th>
            <th>Name</th>
            <th>No. of Users</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {groups
            .filter((g) =>
              g.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((group) => (
              <tr key={group.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <FaUsers style={{ color: "#4da6ff" }} /> {group.name}
                </td>
                <td>
                  <FaUsers style={{ color: "#4da6ff" }} /> {group.users}
                </td>
                <td>
                  <FaTrash className="trash-icon" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="add-group">
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add New Group +
        </button>
      </div>
      {showForm && (
        <div className="add-group-modal-overlay">
          <div className="add-group-modal" ref={modalRef}>
            <h3 className="agm-title">Add New Group</h3>
            <div className="agm-body">
              <div className="agm-field">
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="agm-field">
                <label>Add Employees</label>
                <select disabled>
                  <option>Auto (single user demo)</option>
                </select>
              </div>
            </div>
            <div className="agm-actions">
              <button
                type="button"
                className="submit-btn"
                onClick={handleAddGroup}
                disabled={!newGroup.trim()}
              >
                Add
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return workspace;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_(2021).svg"
            alt="Logo"
          />
        </div>
        <div className="nav-icons">
          <FaBell size={22} className="nav-icon" />
          <FaUserCircle size={25} className="nav-icon" />
        </div>
      </nav>
      <div className="main-content">
        <div className="sidebar">
          <FaThLarge size={30} className="sidebar-icon" />
          <FaUsers size={30} className="sidebar-icon" />
        </div>
        {workspace}
      </div>
    </div>
  );
}

export default AddGroups;
