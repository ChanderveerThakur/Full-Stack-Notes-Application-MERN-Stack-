import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";
import { formatNoteTimestamp } from "../utils/formatDate";

const CARD_ACCENTS = ["accent-violet", "accent-blue", "accent-teal", "accent-amber", "accent-rose"];

function Notes() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [creatingNote, setCreatingNote] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getNotes = async () => {
    setLoadingNotes(true);
    setErrorMessage("");

    try {
      const response = await notesAPI.getAll();
      setNotes(response.data.notes || []);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch notes. Please try again."
      );
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const validateNoteForm = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Note title is required";
    }

    if (!description.trim()) {
      nextErrors.description = "Note description is required";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateNoteForm()) {
      return;
    }

    setCreatingNote(true);

    try {
      await notesAPI.create({
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
      setFormErrors({});
      setSuccessMessage("Note added successfully!");
      await getNotes();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create note. Please try again."
      );
    } finally {
      setCreatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setSuccessMessage("");
    setErrorMessage("");
    setDeletingId(noteId);

    try {
      await notesAPI.delete(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setSuccessMessage("Note deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete note. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setErrorMessage("");

    try {
      await logout();
      navigate("/signup");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to logout. Please try again."
      );
      setLoggingOut(false);
    }
  };

  return (
    <div className="notes-page">
      <header className="notes-header">
        <div className="notes-brand">
          <div className="notes-brand-icon">N</div>
          <div>
            <h1>Notes</h1>
            {user?.fullName && <p>Hello, {user.fullName.split(" ")[0]}</p>}
          </div>
        </div>

        <div className="notes-header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <main className="notes-main">
        <section className="panel add-note-section">
          <div className="panel-header">
            <div>
              <h2>New Note</h2>
              <p className="section-subtitle">Write it down before you forget</p>
            </div>
          </div>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

          <form className="add-note-form" onSubmit={handleAddNote} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="note-title">Title</label>
                <input
                  id="note-title"
                  type="text"
                  placeholder="Meeting ideas, grocery list..."
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setFormErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className={formErrors.title ? "input-error" : ""}
                />
                {formErrors.title && <span className="field-error">{formErrors.title}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="note-description">Description</label>
              <textarea
                id="note-description"
                placeholder="What's on your mind?"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setFormErrors((prev) => ({ ...prev, description: "" }));
                }}
                rows={4}
                className={formErrors.description ? "input-error" : ""}
              />
              {formErrors.description && (
                <span className="field-error">{formErrors.description}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={creatingNote}>
              {creatingNote ? "Saving..." : "+ Add Note"}
            </button>
          </form>
        </section>

        <section className="panel recent-notes-section">
          <div className="section-heading">
            <div>
              <h2>Your Notes</h2>
              <p className="section-subtitle">Everything you&apos;ve saved</p>
            </div>
            <span className="notes-count">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {loadingNotes ? (
            <div className="notes-state">
              <div className="spinner" />
              <p>Loading your notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="notes-state empty-state">
              <div className="empty-icon">✦</div>
              <h3>No notes yet</h3>
              <p>Create your first note above — it will show up here instantly.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note, index) => (
                <article
                  key={note._id}
                  className={`note-card ${CARD_ACCENTS[index % CARD_ACCENTS.length]}`}
                >
                  <div className="note-card-top">
                    <h3>{note.title}</h3>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={deletingId === note._id}
                      aria-label={`Delete note: ${note.title}`}
                      title="Delete note"
                    >
                      {deletingId === note._id ? (
                        <span className="delete-spinner" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="note-body">{note.description}</p>

                  <footer className="note-footer">
                    <time className="note-timestamp">
                      {formatNoteTimestamp(note.createdAt)}
                    </time>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notes;
