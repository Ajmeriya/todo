import { useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api';

const emptyForm = {
  title: '',
  description: '',
  completed: false
};

function formatDate(value) {
  if (!value) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadTodos() {
    setLoading(true);
    setError('');

    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const open = total - completed;

    return { total, completed, open };
  }, [todos]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateTodo(editingId, form);
        setTodos((current) => current.map((todo) => (todo.id === editingId ? updated : todo)));
      } else {
        const created = await createTodo(form);
        setTodos((current) => [created, ...current]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Unable to save task');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(todo) {
    setError('');
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed
      });
      setTodos((current) => current.map((item) => (item.id === todo.id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Unable to update task');
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || 'Unable to delete task');
    }
  }

  function handleEdit(todo) {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed
    });
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Todo Flow</p>
          <h1>Organize your day with a focused task board.</h1>
          <p className="subcopy">
            Create tasks, mark them complete, and keep everything in sync with the Spring Boot backend.
          </p>
        </div>

        <div className="stats">
          <article>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>Open</span>
            <strong>{stats.open}</strong>
          </article>
          <article>
            <span>Done</span>
            <strong>{stats.completed}</strong>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <p className="section-label">Task editor</p>
              <h2>{editingId ? 'Edit todo' : 'Add todo'}</h2>
            </div>
            {editingId ? (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Write the project brief"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Add context, notes, or a checklist"
              rows="5"
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(event) => setForm({ ...form, completed: event.target.checked })}
            />
            Mark as completed
          </label>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update task' : 'Create task'}
          </button>

          {error ? <p className="message error">{error}</p> : null}
        </form>

        <section className="card list-card">
          <div className="card-header">
            <div>
              <p className="section-label">Task list</p>
              <h2>Your todo items</h2>
            </div>
            <button type="button" className="ghost-button" onClick={loadTodos}>
              Refresh
            </button>
          </div>

          {loading ? <p className="message">Loading tasks...</p> : null}
          {!loading && todos.length === 0 ? <p className="message">No tasks yet. Add the first one.</p> : null}

          <div className="todo-list">
            {todos.map((todo) => (
              <article className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  <span className="todo-checkmark" />
                </label>

                <div className="todo-body">
                  <div className="todo-title-row">
                    <h3>{todo.title}</h3>
                    <span className={`status-pill ${todo.completed ? 'done' : 'open'}`}>
                      {todo.completed ? 'Done' : 'Open'}
                    </span>
                  </div>
                  {todo.description ? <p>{todo.description}</p> : <p className="muted">No description provided.</p>}
                  <small>Updated {formatDate(todo.updatedAt || todo.createdAt)}</small>
                </div>

                <div className="todo-actions">
                  <button type="button" className="icon-button" onClick={() => handleEdit(todo)}>
                    Edit
                  </button>
                  <button type="button" className="icon-button danger" onClick={() => handleDelete(todo.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
