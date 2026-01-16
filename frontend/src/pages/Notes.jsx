import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Card from "../components/Card";

function Notes() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const res = await api.get("/notes/");
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!subject || !content) return;

    await api.post("/notes/", {
      subject,
      topic,
      content,
    });

    setSubject("");
    setTopic("");
    setContent("");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="page-container">
      {/* ✍ Add Note */}
      <Card>
        <h2>📝 Notes</h2>

        <input
          placeholder="Subject (e.g. DevOps)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          placeholder="Topic (optional)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <textarea
          placeholder="Write your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: "120px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.1)",
            marginBottom: "14px",
          }}
        />

        <button className="primary-btn" onClick={addNote}>
          Save Note
        </button>
      </Card>

      {/* 📖 Notes List */}
      {notes.map((note, index) => (
        <Card key={index}>
          <h4>
            {note.subject}
            {note.topic && ` – ${note.topic}`}
          </h4>
          <p style={{ color: "#374151" }}>{note.content}</p>
        </Card>
      ))}
    </div>
  );
}

export default Notes;
