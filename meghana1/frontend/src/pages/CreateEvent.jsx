import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    totalSeats: 10
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "totalSeats" ? Number(e.target.value) : e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/events", form);
      setSuccess(res.data.message || "Event created successfully");
      setTimeout(() => navigate("/events"), 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-3 text-sm text-green-600">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            name="venue"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.venue}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            min={1}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.totalSeats}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

