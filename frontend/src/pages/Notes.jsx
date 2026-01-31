import React, { useEffect, useState } from "react";
import api from "../utils/api";

function Notes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/saved/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    setLoading(true);
    try {
      await api.post("/saved/notes", {
        title: title.trim(),
        content: content.trim(),
        category: category
      });

      setTitle("");
      setContent("");
      setCategory("General");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note:", err);
      alert("❌ Failed to save note");
    }
    setLoading(false);
  };

  const updateNote = async () => {
    if (!editingNote || !title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await api.put(`/saved/notes/${editingNote.id}`, {
        title: title.trim(),
        content: content.trim(),
        category: category
      });

      setEditingNote(null);
      setTitle("");
      setContent("");
      setCategory("General");
      fetchNotes();
    } catch (err) {
      console.error("Failed to update note:", err);
      alert("❌ Failed to update note");
    }
    setLoading(false);
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/saved/notes/${noteId}`);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      alert("❌ Failed to delete note");
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("General");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📝</span>
          My Notes
        </h1>
        <p className="page-subtitle">
          Create, organize, and manage your personal study notes
        </p>
      </div>

      {/* Add/Edit Note Card */}
      <div className="card">
        <div className="card-header">
          <h2>{editingNote ? "✏️ Edit Note" : "➕ Create New Note"}</h2>
          <p>{editingNote ? "Update your note" : "Add a new note to your collection"}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            placeholder="Note title (e.g., Python Basics, DevOps Commands)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border-soft)',
              fontSize: '1rem',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              marginBottom: '1rem'
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border-soft)',
              fontSize: '1rem',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              marginBottom: '1rem'
            }}
          >
            <option value="General">General</option>
            <option value="Programming">Programming</option>
            <option value="DevOps">DevOps</option>
            <option value="Data Science">Data Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            placeholder="Write your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border-soft)',
              fontSize: '1rem',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="primary-btn" 
            onClick={editingNote ? updateNote : addNote}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Saving..." : (editingNote ? "💾 Update Note" : "➕ Save Note")}
          </button>
          
          {editingNote && (
            <button 
              className="secondary-btn" 
              onClick={cancelEditing}
              style={{ flex: 1 }}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3>No Notes Yet</h3>
            <p>Create your first note to get started!</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {notes.map((note) => (
            <div key={note.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
                    {note.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    <span>📁 {note.category}</span>
                    <span>📅 {new Date(note.created_at).toLocaleDateString()}</span>
                    {note.updated_at !== note.created_at && (
                      <span>✏️ Updated {new Date(note.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => startEditing(note)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '1.2rem'
                    }}
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '1.2rem'
                    }}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.6', 
                color: '#374151',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
