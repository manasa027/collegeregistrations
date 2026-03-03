import React, { useState } from "react";
import api from "../api/axios";

const ViewRegistrations = () => {
  const [eventId, setEventId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!eventId) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data || []);
      if ((res.data || []).length === 0) {
        setMessage("No students registered for this event yet.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load registrations");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">View Event Registrations</h1>
      <form onSubmit={handleFetch} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </form>
      {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}
      {registrations.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Registered Students ({registrations.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Full Name</th>
                  <th className="px-2 py-1 text-left">Roll Number</th>
                  <th className="px-2 py-1 text-left">Year</th>
                  <th className="px-2 py-1 text-left">Section</th>
                  <th className="px-2 py-1 text-left">Email</th>
                  <th className="px-2 py-1 text-left">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id} className="border-t">
                    <td className="px-2 py-1">{reg.fullName}</td>
                    <td className="px-2 py-1">{reg.rollNumber}</td>
                    <td className="px-2 py-1">{reg.year}</td>
                    <td className="px-2 py-1">{reg.section}</td>
                    <td className="px-2 py-1">{reg.email}</td>
                    <td className="px-2 py-1">{new Date(reg.registeredAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRegistrations;

