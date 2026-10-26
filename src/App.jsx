import { useState } from "react";
import { CheckSquare, NotebookPen, Sparkles } from "lucide-react";
import TodoApp from "./components/TodoApp.jsx";
import NotesApp from "./components/NotesApp.jsx";
import "./styles/App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Focus Desk home">
          <span className="brand-mark"><Sparkles size={21} /></span>
          <span>focus<span className="brand-light">desk</span></span>
        </a>
        <span className="topbar-caption">A calmer way to get things done</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL WORKSPACE</div>
        <h1>Make space for <span>what matters.</span></h1>
        <p>Plan your day, capture your thoughts, and keep everything in one place.</p>
      </section>

      <nav className="tabs" aria-label="Workspace sections">
        <button className={`tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")} aria-pressed={activeTab === "tasks"}>
          <CheckSquare size={18} /> To-Do List
        </button>
        <button className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")} aria-pressed={activeTab === "notes"}>
          <NotebookPen size={18} /> Notes
        </button>
      </nav>

      <section className="workspace">
        {activeTab === "tasks" ? <TodoApp /> : <NotesApp />}
      </section>

      <footer className="footer">Built with React · Your tasks and notes stay in this browser</footer>
    </main>
  );
}