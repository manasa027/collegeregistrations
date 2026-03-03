import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 text-gray-700">
        Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
      </p>

      {user.role === "Admin" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Manage Events</h2>
            <p className="text-sm text-gray-600 mb-2">View and delete any event if needed.</p>
            <Link to="/events" className="text-sm text-blue-600">
              View All Events
            </Link>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">View Users</h2>
            <p className="text-sm text-gray-600 mb-2">
              Use admin tools (via API or future UI) to manage users.
            </p>
          </div>
        </div>
      )}

      {user.role === "EventOwner" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">My Events</h2>
            <p className="text-sm text-gray-600 mb-2">View your events and registrations.</p>
            <Link to="/events" className="text-sm text-blue-600">
              View Events
            </Link>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Create New Event</h2>
            <p className="text-sm text-gray-600 mb-2">Publish new events for students to register.</p>
            <Link to="/events/create" className="text-sm text-blue-600">
              Create Event
            </Link>
          </div>
        </div>
      )}

      {user.role === "Student" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Browse Events</h2>
            <p className="text-sm text-gray-600 mb-2">View all published events and register.</p>
            <Link to="/events" className="text-sm text-blue-600">
              View Events
            </Link>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">My Registrations</h2>
            <p className="text-sm text-gray-600 mb-2">See which events you have registered for.</p>
            <Link to="/my-registrations" className="text-sm text-blue-600">
              View My Registrations
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

