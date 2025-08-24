import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmployeeDetails from "./components/EmployeeDetails";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployeeProfile from "./components/EmployeeProfile";
import AdminDashboard from "./components/AdminDashboard";
import AdminProfile from "./components/AdminProfile";

function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = !!localStorage.getItem("loginEmail");
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && localStorage.getItem("isAdmin") !== "true") {
    return <Navigate to="/employeeDashboard" replace />;
  }
  return children;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/employeedetails"
          element={
            <ProtectedRoute>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeeDashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeeProfile"
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminProfile"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
