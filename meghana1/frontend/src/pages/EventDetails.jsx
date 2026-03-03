import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    rollNumber: "",
    year: "1st",
    section: "",
    email: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailsError, setEmailsError] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
      if (user?.role === "Student") {
        setForm((prev) => ({ ...prev, email: user.email, fullName: user.name }));
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoadingEvent(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const payload = { ...form, eventId: id };
      const res = await api.post("/registrations", payload);
      setMessage(res.data.message || "Registration successful");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadRegisteredEmails = async () => {
    setLoadingEmails(true);
    setEmailsError("");
    try {
      const res = await api.get(`/events/${id}/registrations`);
      // Backend returns: { registrations, emails }
      const emailList = res.data?.emails || [];
      setEmails(emailList);
    } catch (error) {
      setEmailsError(error.response?.data?.message || "Failed to load registered emails.");
      setEmails([]);
    } finally {
      setLoadingEmails(false);
    }
  };

  if (loadingEvent) return <p className="text-center mt-8">Loading event...</p>;
  if (!event) return <p className="text-center mt-8 text-red-600">Event not found.</p>;

  const seatsFull = event.availableSeats <= 0;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white rounded shadow p-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{event.description}</p>
        <p className="text-xs text-gray-600">Date: {new Date(event.date).toLocaleString()}</p>
        <p className="text-xs text-gray-600">Venue: {event.venue}</p>
        <p className="text-xs text-gray-600">
          Seats left: {event.availableSeats}/{event.totalSeats}
        </p>
        {event.owner && (
          <p className="text-xs text-gray-600 mt-1">
            Organised by: {event.owner.name} ({event.owner.email})
          </p>
        )}
      </div>

      {(user?.role === "EventOwner" || user?.role === "Admin") && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Registered Emails</h2>
            <button
              type="button"
              onClick={loadRegisteredEmails}
              disabled={loadingEmails}
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loadingEmails ? "Loading..." : "Load Emails"}
            </button>
          </div>
          {emailsError && <p className="mt-2 text-sm text-red-600">{emailsError}</p>}
          {emails.length > 0 ? (
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
              {emails.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          ) : (
            !emailsError && <p className="mt-2 text-sm text-gray-600">No registrations yet.</p>
          )}
        </div>
      )}

      {user?.role === "Student" ? (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Register for this Event</h2>
          {message && (
            <p
              className={`mb-3 text-sm ${
                message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          {seatsFull ? (
            <p className="text-red-600 text-sm">Seats are full for this event.</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  name="fullName"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <input
                  name="rollNumber"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  name="year"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.year}
                  onChange={handleChange}
                  required
                >
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <input
                  name="section"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.section}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          {user ? "Only students can register for events." : "Please login as a student to register."}
        </p>
      )}
    </div>
  );
};

export default EventDetails;

