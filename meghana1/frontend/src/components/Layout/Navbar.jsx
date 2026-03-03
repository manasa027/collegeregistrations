import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          College Events
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-gray-700 hover:text-blue-600 text-sm">
            Events
          </Link>
          {isAuthenticated && user?.role === "EventOwner" && (
            <Link to="/events/create" className="text-gray-700 hover:text-blue-600 text-sm">
              Create Event
            </Link>
          )}
          {isAuthenticated && user?.role === "Student" && (
            <Link to="/my-registrations" className="text-gray-700 hover:text-blue-600 text-sm">
              My Registrations
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm">
              Dashboard
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 text-sm rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
          {isAuthenticated && (
            <span className="ml-2 text-xs text-gray-500">
              {user.name} ({user.role})
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

