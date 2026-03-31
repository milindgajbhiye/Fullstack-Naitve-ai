const API_URL = '/api';

export async function createDocument(title, owner) {
  const res = await fetch(`${API_URL}/docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, owner })
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function fetchUserDocuments(user) {
  const res = await fetch(`${API_URL}/docs?user=${encodeURIComponent(user)}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchDocument(id) {
  const res = await fetch(`${API_URL}/docs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function updateDocument(id, { title, content }, user) {
  const res = await fetch(`${API_URL}/docs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, user })
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function shareDocument(id, shareWith, user) {
  const res = await fetch(`${API_URL}/docs/${id}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shareWith, user })
  });
  if (!res.ok) throw new Error('Failed to share document');
  return res.json();
}

export async function deleteDocument(id, user) {
  const res = await fetch(`${API_URL}/docs/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}
