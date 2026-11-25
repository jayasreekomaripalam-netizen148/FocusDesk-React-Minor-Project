
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Search,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  CalendarDays,
  Menu,
  Sparkles,
  Clock3,
  ListTodo
} from "lucide-react";

const readData = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const uid = () => Date.now() + Math.random().toString(36).slice(2);

const dateLabel = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

function Sidebar({ page, setPage, mobileOpen, close }) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <div className="brandmark">
          <Sparkles size={20} />
        </div>
        <span>FocusDesk</span>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <button
        className={`nav-item ${page === "dashboard" ? "active" : ""}`}
        onClick={() => {
          setPage("dashboard");
          close();
        }}
      >
        <LayoutDashboard size={18} /> Overview
      </button>

      <button
        className={`nav-item ${page === "tasks" ? "active" : ""}`}
        onClick={() => {
          setPage("tasks");
          close();
        }}
      >
        <CheckSquare size={18} /> My Tasks
      </button>

      <button
        className={`nav-item ${page === "notes" ? "active" : ""}`}
        onClick={() => {
          setPage("notes");
          close();
        }}
      >
        <StickyNote size={18} /> Notes
      </button>

      <div className="sidebar-bottom">
        <div className="tip">
          <Sparkles size={17} />
          <div>
            <strong>Stay focused</strong>
            <p>Small steps make big progress.</p>
          </div>
        </div>

        <div className="profile">
          <div className="avatar">F</div>
          <div>
            <strong>FocusDesk User</strong>
            <small>Personal workspace</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TaskRow({
  task,
  toggle,
  remove,
  editing,
  setEditing,
  editText,
  setEditText,
  save
}) {
  return (
    <div className={`task-row ${task.completed ? "done" : ""}`}>
      <button
        className={`check-btn ${task.completed ? "checked" : ""}`}
        onClick={() => toggle(task.id)}
        aria-label="Toggle completion"
      >
        {task.completed && <Check size={15} />}
      </button>

      <div className="task-content">
        {editing === task.id ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save(task.id)}
          />
        ) : (
          <span className="task-title">{task.text}</span>
        )}

        {task.due && (
          <small className="due-label">
            <CalendarDays size={12} /> {task.due}
          </small>
        )}
      </div>

      <div className="row-actions">
        {editing === task.id ? (
          <>
            <button onClick={() => save(task.id)} title="Save">
              <Check size={16} />
            </button>
            <button onClick={() => setEditing(null)} title="Cancel">
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setEditText(task.text);
                setEditing(task.id);
              }}
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button onClick={() => remove(task.id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TaskPanel({ tasks, setTasks, compact = false }) {
  const [filter, setFilter] = useState("All");
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const add = () => {
    if (!text.trim()) return;

    setTasks((prev) => [
      {
        id: uid(),
        text: text.trim(),
        completed: false,
        due
      },
      ...prev
    ]);

    setText("");
    setDue("");
  };

  const visible = tasks.filter(
    (task) =>
      filter === "All" ||
      (filter === "Completed" ? task.completed : !task.completed)
  );

  const toggle = (id) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );

  const remove = (id) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  const save = (id) => {
    if (editText.trim()) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, text: editText.trim() }
            : task
        )
      );
    }
    setEditing(null);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>{compact ? "Your tasks" : "Task manager"}</h2>
          <p>{tasks.filter((task) => !task.completed).length} tasks left</p>
        </div>

        {!compact && (
          <div className="filters">
            {["All", "Pending", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? "selected" : ""}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="task-add">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task..."
        />

        <input
          className="due-input"
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />

        <button className="primary-btn" onClick={add}>
          <Plus size={17} /> Add task
        </button>
      </div>

      {(compact ? visible.slice(0, 5) : visible).map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          toggle={toggle}
          remove={remove}
          editing={editing}
          setEditing={setEditing}
          editText={editText}
          setEditText={setEditText}
          save={save}
        />
      ))}

      {visible.length === 0 && (
        <div className="empty">
          <ListTodo size={30} />
          <strong>No tasks here</strong>
          <span>Add a task to get started.</span>
        </div>
      )}
    </section>
  );
}

function NotesPanel({ notes, setNotes, compact = false }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cat, setCat] = useState("Personal");
  const [editing, setEditing] = useState(null);

  const filtered = notes.filter(
    (note) =>
      (category === "All" || note.category === category) &&
      `${note.title} ${note.body}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  const save = () => {
    if (!title.trim() && !body.trim()) return;

    const note = {
      id: editing || uid(),
      title: title.trim() || "Untitled",
      body: body.trim(),
      category: cat,
      updated: new Date().toISOString()
    };

    setNotes((prev) =>
      editing
        ? prev.map((n) => (n.id === editing ? note : n))
        : [note, ...prev]
    );

    setTitle("");
    setBody("");
    setEditing(null);
  };

  const edit = (note) => {
    setEditing(note.id);
    setTitle(note.title);
    setBody(note.body);
    setCat(note.category || "Personal");
  };

  const remove = (id) =>
    setNotes((prev) => prev.filter((note) => note.id !== id));

  const colors = ["lavender", "mint", "peach", "blue"];

  return (
    <section className="panel notes-panel">
      <div className="panel-head">
        <div>
          <h2>{compact ? "Recent notes" : "Your notes"}</h2>
          <p>Capture ideas and keep them organized</p>
        </div>
      </div>

      {!compact && (
        <div className="note-editor">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something worth remembering..."
            rows="3"
          />

          <div className="editor-bottom">
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option>Personal</option>
              <option>Work</option>
              <option>Study</option>
              <option>Ideas</option>
            </select>

            <button className="primary-btn" onClick={save}>
              <Plus size={16} />
              {editing ? "Save changes" : "Create note"}
            </button>

            {editing && (
              <button
                className="soft-btn"
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setBody("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {!compact && (
        <div className="notes-tools">
          <div className="search-box">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
            />
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Personal</option>
            <option>Work</option>
            <option>Study</option>
            <option>Ideas</option>
          </select>
        </div>
      )}

      <div className="notes-grid">
        {(compact ? filtered.slice(0, 4) : filtered).map((note, i) => (
          <article
            className={`note-card ${colors[i % colors.length]}`}
            key={note.id}
          >
            <div className="note-top">
              <span className="note-category">{note.category}</span>

              <div>
                <button onClick={() => edit(note)} title="Edit">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove(note.id)} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <h3>{note.title}</h3>
            <p>{note.body}</p>

            <footer>
              <Clock3 size={12} />
              {new Date(note.updated).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
              })}
            </footer>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <StickyNote size={30} />
          <strong>No notes found</strong>
          <span>Create your first note above.</span>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [tasks, setTasks] = useState(() =>
    readData("focusdesk_tasks", [])
  );

  const [notes, setNotes] = useState(() =>
    readData("focusdesk_notes", [])
  );

  useEffect(() => {
    localStorage.setItem("focusdesk_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("focusdesk_notes", JSON.stringify(notes));
  }, [notes]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        close={() => setMobileOpen(false)}
      />

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            {page === "dashboard"
              ? "Overview"
              : page === "tasks"
                ? "My Tasks"
                : "Notes"}
          </div>

          <div className="today">{dateLabel()}</div>
        </header>

        <div className="page-content">
          <div className="welcome">
            <div>
              <div className="eyebrow">
                YOUR PERSONAL PRODUCTIVITY HUB
              </div>

              <h1>
                {page === "dashboard"
                  ? "Good day. Let's make it count."
                  : page === "tasks"
                    ? "Manage your tasks"
                    : "Your ideas, in one place"}
              </h1>

              <p>
                {page === "dashboard"
                  ? "Plan your day, keep track of tasks and collect your thoughts."
                  : page === "tasks"
                    ? "Organize your priorities and make progress one task at a time."
                    : "Create, search and organize your notes."}
              </p>
            </div>

            <div className="welcome-art">
              <Sparkles size={34} />
            </div>
          </div>

          {page === "dashboard" ? (
            <>
              <div className="stats">
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <ListTodo />
                  </div>
                  <div>
                    <span>Total tasks</span>
                    <strong>{tasks.length}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <CheckSquare />
                  </div>
                  <div>
                    <span>Completed</span>
                    <strong>{completed}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">
                    <Clock3 />
                  </div>
                  <div>
                    <span>Pending</span>
                    <strong>{pending}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">
                    <StickyNote />
                  </div>
                  <div>
                    <span>Notes saved</span>
                    <strong>{notes.length}</strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-columns">
                <TaskPanel tasks={tasks} setTasks={setTasks} compact />
                <NotesPanel notes={notes} setNotes={setNotes} compact />
              </div>
            </>
          ) : page === "tasks" ? (
            <TaskPanel tasks={tasks} setTasks={setTasks} />
          ) : (
            <NotesPanel notes={notes} setNotes={setNotes} />
          )}

          <footer className="app-footer">
            Made for focused days <span>•</span> FocusDesk
          </footer>
        </div>
      </main>
    </div>
  );
}
