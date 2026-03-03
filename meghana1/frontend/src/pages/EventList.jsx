import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading events...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Published Events</h1>
      {events.length === 0 ? (
        <p className="text-gray-600">No events available right now.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded shadow p-4 flex flex-col">
              <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{event.description}</p>
              <p className="text-xs text-gray-600">Date: {new Date(event.date).toLocaleString()}</p>
              <p className="text-xs text-gray-600">Venue: {event.venue}</p>
              <p className="text-xs text-gray-600">
                Seats left: {event.availableSeats}/{event.totalSeats}
              </p>
              <Link to={`/events/${event._id}`} className="mt-3 inline-block text-sm text-blue-600">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;

