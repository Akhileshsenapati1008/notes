import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notes on initial mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setNotes(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      const res = await axios.post(API_URL, formData);
      setNotes([res.data, ...notes]);
      setFormData({ title: "", content: "" });
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>Notes Manager</h1>

      {/* Note Creation Form */}
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Note Content..."
          value={formData.content}
          onChange={handleChange}
          rows="4"
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <hr />

      {/* Reactive State Feedback */}
      {loading ? (
        <p className="status-msg">Loading notes...</p>
      ) : error ? (
        <p className="status-msg error">{error}</p>
      ) : notes.length === 0 ? (
        <p className="status-msg">No notes yet — add one above!</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p className="content">{note.content}</p>
              <span className="date">
                {new Date(note.createdAt).toLocaleString()}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(note._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}