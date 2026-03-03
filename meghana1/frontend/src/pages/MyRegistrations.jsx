import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading your registrations...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
      {registrations.length === 0 ? (
        <p className="text-gray-600">You have not registered for any events yet.</p>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div key={reg._id} className="bg-white rounded shadow p-3">
              <p className="font-semibold">
                {reg.event?.title || "Event deleted"}{" "}
                <span className="text-xs text-gray-500">
                  ({new Date(reg.registeredAt).toLocaleString()})
                </span>
              </p>
              <p className="text-xs text-gray-600">
                Venue: {reg.event?.venue} | Date:{" "}
                {reg.event?.date ? new Date(reg.event.date).toLocaleString() : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;

