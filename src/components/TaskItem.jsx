import { Check, Pencil, Trash2, X } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <article className={`task-item ${task.completed ? "task-completed" : ""}`}>
      <button
        className={`check-button ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark task as pending" : "Mark task as completed"}
        title={task.completed ? "Mark pending" : "Mark completed"}
      >
        {task.completed && <Check size={15} />}
      </button>
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className={`status-pill ${task.completed ? "done" : "pending"}`}>
            {task.completed ? "Completed" : "Pending"}
          </span>
          {task.dueDate && <span className="due-date">Due {task.dueDate}</span>}
        </div>
      </div>
      <div className="item-actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit task">
          <Pencil size={16} />
        </button>
        <button className="icon-button danger" onClick={() => onDelete(task.id)} aria-label="Delete task" title="Delete task">
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}