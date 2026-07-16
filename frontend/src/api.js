const apiBaseUrl = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const payload = await response.json();
      message = payload.error || payload.message || message;
    } catch {
      message = await response.text() || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTodos() {
  return request('/api/todos');
}

export function createTodo(todo) {
  return request('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todo)
  });
}

export function updateTodo(id, todo) {
  return request(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo)
  });
}

export function deleteTodo(id) {
  return request(`/api/todos/${id}`, {
    method: 'DELETE'
  });
}
