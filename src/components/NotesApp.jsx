import { useEffect, useMemo, useState } from "react";
import { Plus, Search, NotebookPen, X, Save } from "lucide-react";
import NoteCard from "./NoteCard.jsx";

const STORAGE_KEY = "focusdesk_notes_v1";
const COLORS = ["lavender", "mint", "peach", "blue"];
const CATEGORIES = ["Personal", "Study", "Work", "Ideas", "Other"];

const readNotes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function NotesApp() {
  const [notes, setNotes] = useState(readNotes);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Personal");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const categories = useMemo(() => ["All", ...new Set([...CATEGORIES, ...notes.map((note) => note.category)])], [notes]);
  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesSearch = !query || `${note.title} ${note.body} ${note.category}`.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "All" || note.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes, search, categoryFilter]);

  const resetEditor = () => {
    setTitle("");
    setBody("");
    setCategory("Personal");
    setEditingId(null);
    setFormError("");
    setIsEditorOpen(false);
  };

  const openNewNote = () => {
    setTitle(""); setBody(""); setCategory("Personal");
    setEditingId(null); setFormError(""); setIsEditorOpen(true);
  };

  const openEditNote = (note) => {
    setTitle(note.title); setBody(note.body); setCategory(note.category);
    setEditingId(note.id); setFormError(""); setIsEditorOpen(true);
  };

  const saveNote = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFormError("Please enter both a title and note content.");
      return;
    }
    const now = new Date().toISOString();
    if (editingId) {
      setNotes((previous) => previous.map((note) => note.id === editingId
        ? { ...note, title: title.trim(), body: body.trim(), category, updatedAt: now }
        : note));
    } else {
      const note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        category,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        createdAt: now,
        updatedAt: now
      };
      setNotes((previous) => [note, ...previous]);
    }
    resetEditor();
  };

  const deleteNote = (id) => setNotes((previous) => previous.filter((note) => note.id !== id));

  return (
    <div className="panel">
      <div className="section-heading notes-heading">
        <div>
          <div className="section-kicker">CAPTURE YOUR THOUGHTS</div>
          <h2>Your notes</h2>
          <p className="section-subtitle">Keep the ideas you don't want to lose.</p>
        </div>
        <button className="primary-button" onClick={openNewNote}><Plus size={18} /> New note</button>
      </div>

      <div className="notes-toolbar">
        <div className="search-box">
          <Search size={18} />
          <label className="sr-only" htmlFor="search-notes">Search notes</label>
          <input id="search-notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes..." />
          {search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}
        </div>
        <label className="sr-only" htmlFor="note-category-filter">Filter notes by category</label>
        <select id="note-category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>)}
        </select>
      </div>

      {isEditorOpen && (
        <div className="editor-overlay" role="dialog" aria-modal="true" aria-labelledby="note-editor-title">
          <form className="note-editor" onSubmit={saveNote}>
            <div className="editor-header">
              <div><div className="section-kicker">{editingId ? "MAKE A CHANGE" : "NEW THOUGHT"}</div><h3 id="note-editor-title">{editingId ? "Edit note" : "Create a note"}</h3></div>
              <button className="icon-button" type="button" onClick={resetEditor} aria-label="Close editor"><X size={19} /></button>
            </div>
            <label htmlFor="note-title">Title</label>
            <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your note a title" maxLength={100} />
            <label htmlFor="note-category">Category</label>
            <select id="note-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
            <label htmlFor="note-body">Your note</label>
            <textarea id="note-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Start writing..." rows={6} maxLength={5000} />
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="editor-actions">
              <button type="button" className="secondary-button" onClick={resetEditor}>Cancel</button>
              <button type="submit" className="primary-button"><Save size={17} /> Save note</button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-summary"><span>{visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}</span><span>Saved automatically</span></div>
      {visibleNotes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><NotebookPen size={25} /></span>
          <strong>{notes.length === 0 ? "Your ideas start here" : "No notes found"}</strong>
          <p>{notes.length === 0 ? "Create a note to collect your thoughts, plans, and ideas." : "Try a different search or category."}</p>
          {notes.length === 0 && <button className="text-button" onClick={openNewNote}>Create your first note <Plus size={15} /></button>}
        </div>
      ) : (
        <div className="notes-grid">
          {visibleNotes.map((note) => <NoteCard key={note.id} note={note} onEdit={openEditNote} onDelete={deleteNote} />)}
        </div>
      )}
    </div>
  );
}