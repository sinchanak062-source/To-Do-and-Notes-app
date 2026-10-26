import { useEffect, useMemo, useState } from "react";
import { Plus, ListTodo, CircleCheck, Clock3 } from "lucide-react";
import TaskItem from "./TaskItem.jsx";

const STORAGE_KEY = "focusdesk_tasks_v1";
const readTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function TodoApp() {
  const [tasks, setTasks] = useState(readTasks);
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter(({ completed }) => completed).length;
  const pendingCount = tasks.length - completedCount;
  const filteredTasks = useMemo(
    () => tasks.filter((task) => filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed)),
    [tasks, filter]
  );

  const addTask = (event) => {
    event.preventDefault();
    const title = taskText.trim();
    if (!title) return;
    setTasks((previous) => [{
      id: crypto.randomUUID(),
      title,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    }, ...previous]);
    setTaskText("");
    setDueDate("");
  };

  const toggleTask = (id) => {
    setTasks((previous) => previous.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const beginEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
    setEditDate(task.dueDate || "");
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const title = editText.trim();
    if (!title) return;
    setTasks((previous) => previous.map((task) =>
      task.id === editingId ? { ...task, title, dueDate: editDate } : task
    ));
    setEditingId(null);
  };

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <div className="section-kicker">STAY ON TRACK</div>
          <h2>Your tasks</h2>
          <p className="section-subtitle">Small steps add up to big progress.</p>
        </div>
        <div className="heading-icon purple"><ListTodo size={22} /></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-icon violet"><ListTodo size={17} /></span><div><strong>{tasks.length}</strong><span>Total tasks</span></div></div>
        <div className="stat-card"><span className="stat-icon green"><CircleCheck size={17} /></span><div><strong>{completedCount}</strong><span>Completed</span></div></div>
        <div className="stat-card"><span className="stat-icon amber"><Clock3 size={17} /></span><div><strong>{pendingCount}</strong><span>Pending</span></div></div>
      </div>

      <form className="task-form" onSubmit={addTask}>
        <label className="sr-only" htmlFor="new-task">New task</label>
        <input id="new-task" value={taskText} onChange={(event) => setTaskText(event.target.value)}
          placeholder="What needs to get done?" maxLength={180} />
        <label className="sr-only" htmlFor="task-date">Due date</label>
        <input id="task-date" className="date-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <button className="primary-button" type="submit"><Plus size={18} /> Add task</button>
      </form>

      <div className="list-toolbar">
        <h3>Task list <span className="count-badge">{filteredTasks.length}</span></h3>
        <div className="filter-group" role="group" aria-label="Filter tasks">
          {[["all", "All"], ["pending", "Pending"], ["completed", "Completed"]].map(([value, label]) => (
            <button key={value} className={`filter-button ${filter === value ? "selected" : ""}`}
              onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><ListTodo size={25} /></span>
          <strong>{tasks.length === 0 ? "A fresh start" : "Nothing here right now"}</strong>
          <p>{tasks.length === 0 ? "Add your first task above and build some momentum." : "Try another filter or add a new task."}</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => editingId === task.id ? (
            <form className="edit-task-form" key={task.id} onSubmit={saveEdit}>
              <input aria-label="Edit task title" value={editText} onChange={(event) => setEditText(event.target.value)} autoFocus maxLength={180} />
              <input aria-label="Edit due date" type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} />
              <button className="icon-button save-action" type="submit" aria-label="Save edit"><CircleCheck size={17} /></button>
              <button className="icon-button" type="button" onClick={() => setEditingId(null)} aria-label="Cancel edit"><X size={17} /></button>
            </form>
          ) : (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={beginEdit} />
          ))}
        </div>
      )}
    </div>
  );
}