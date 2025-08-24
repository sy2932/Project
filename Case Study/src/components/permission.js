import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

// Lightweight placeholder Permission component.
// Toggle internal state to simulate granting/revoking permission.
export default function Permission({ email, employeeId }) {
  const key = email
    ? `perm_${email}`
    : employeeId
    ? `perm_id_${employeeId}`
    : null;
  const [granted, setGranted] = useState(true); // default allow

  useEffect(() => {
    if (!key) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setGranted(raw === "1");
      }
    } catch {
      /* ignore */
    }
  }, [key]);

  const toggle = () => {
    const next = !granted;
    setGranted(next);
    if (key) {
      try {
        localStorage.setItem(key, next ? "1" : "0");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
      }}
      title={
        granted
          ? "Click to lock (hide reports)"
          : "Click to unlock (show reports)"
      }
    >
      {granted ? (
        <FaUnlock style={{ color: "green" }} />
      ) : (
        <FaLock style={{ color: "#ff0000ff" }} />
      )}
    </button>
  );
}
