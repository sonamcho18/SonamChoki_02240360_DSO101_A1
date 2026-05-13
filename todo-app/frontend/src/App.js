import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Simple SVG Icons (no extra package needed)
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const task = await res.json();
      setTasks([task, ...tasks]);
      setNewTitle('');
    } catch {
      setError('Failed to add task.');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (task) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim(), completed: task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      setEditId(null);
    } catch {
      setError('Failed to save task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const filtered = tasks.filter(t =>
    filter === 'active' ? !t.completed :
    filter === 'completed' ? t.completed : true
  );

  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <h1 className="title">TaskFlow</h1>
            <p className="subtitle">Stay organized and stay productive</p>
          </div>
          <div className="stats">
            <div className="stat"><span className="stat-num">{counts.all}</span><span className="stat-label">Total</span></div>
            <div className="stat"><span className="stat-num">{counts.active}</span><span className="stat-label">Active</span></div>
            <div className="stat"><span className="stat-num">{counts.completed}</span><span className="stat-label">Done</span></div>
          </div>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            className="add-input"
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Add a new task..."
          />
          <button className="add-btn" type="submit"><PlusIcon /> Add Task</button>
        </form>

        {error && <div className="error-msg">{error} <button onClick={() => setError('')}><CloseIcon /></button></div>}

        <div className="filter-bar">
          {['all','active','completed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="task-list">
          {loading && <div className="empty-state">Loading tasks...</div>}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              {filter === 'completed' ? 'No completed tasks yet.' :
               filter === 'active' ? 'No active tasks. Add one above!' :
               'No tasks yet. Add your first task!'}
            </div>
          )}
          {filtered.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <button className={`check-btn ${task.completed ? 'checked' : ''}`} onClick={() => toggleComplete(task)}>
                {task.completed && <CheckIcon />}
              </button>

              <div className="task-content">
                {editId === task.id ? (
                  <input
                    className="edit-input"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(task)}
                    autoFocus
                  />
                ) : (
                  <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>{task.title}</span>
                )}
              </div>

              <div className="task-actions">
                {editId === task.id ? (
                  <>
                    <button className="action-btn save" onClick={() => saveEdit(task)} title="Save"><SaveIcon /></button>
                    <button className="action-btn cancel" onClick={() => setEditId(null)} title="Cancel"><CloseIcon /></button>
                  </>
                ) : (
                  <>
                    <button className="action-btn edit" onClick={() => startEdit(task)} title="Edit"><EditIcon /></button>
                    <button className="action-btn delete" onClick={() => deleteTask(task.id)} title="Delete"><TrashIcon /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
