import { Pencil, Trash2 } from "lucide-react";

export default function NoteCard({ note, onEdit, onDelete }) {
  const updated = new Date(note.updatedAt).toLocaleString([], {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  return (
    <article className={`note-card note-${note.color}`}>
      <div className="note-card-top">
        <span className="category-tag">{note.category}</span>
        <div className="item-actions">
          <button className="icon-button" onClick={() => onEdit(note)} aria-label="Edit note" title="Edit note"><Pencil size={15} /></button>
          <button className="icon-button danger" onClick={() => onDelete(note.id)} aria-label="Delete note" title="Delete note"><Trash2 size={15} /></button>
        </div>
      </div>
      <h3>{note.title}</h3>
      <p className="note-body">{note.body}</p>
      <div className="note-footer"><span>Updated {updated}</span></div>
    </article>
  );
}