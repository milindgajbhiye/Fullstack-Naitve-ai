import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';

let server;
let baseUrl;

const ownerEmail = 'user1@gmail.com';
const sharedEmail = 'user2@gmail.com';
const testDocTitle = `Test-${Date.now()}`;
let createdDocId;

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
};

test.before(async () => {
  server = app.listen(0);

  await new Promise((resolve) => {
    server.on('listening', resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  if (createdDocId) {
    await request(`/api/docs/${createdDocId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: ownerEmail })
    });
  }

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

test('share flow grants collaborator access but not delete rights', async () => {
  const created = await request('/api/docs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: testDocTitle, owner: ownerEmail })
  });

  assert.equal(created.response.status, 201);
  assert.ok(created.body.id);
  createdDocId = created.body.id;

  const shared = await request(`/api/docs/${createdDocId}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: ownerEmail, shareWith: sharedEmail })
  });

  assert.equal(shared.response.status, 200);
  assert.ok(Array.isArray(shared.body.sharedWith));
  assert.ok(shared.body.sharedWith.includes(sharedEmail));

  const listForSharedUser = await request(`/api/docs?user=${encodeURIComponent(sharedEmail)}`);

  assert.equal(listForSharedUser.response.status, 200);
  const sharedDoc = listForSharedUser.body.find((doc) => doc.id === createdDocId);
  assert.ok(sharedDoc, 'Shared user should be able to see the shared document');
  assert.equal(sharedDoc.isOwner, false);

  const updateBySharedUser = await request(`/api/docs/${createdDocId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `${testDocTitle}-updated-by-shared-user`,
      content: '<p>updated by shared user</p>',
      user: sharedEmail
    })
  });

  assert.equal(updateBySharedUser.response.status, 200);

  const deleteBySharedUser = await request(`/api/docs/${createdDocId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: sharedEmail })
  });

  assert.equal(deleteBySharedUser.response.status, 403);
});
