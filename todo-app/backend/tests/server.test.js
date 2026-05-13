const request = require('supertest');
const { app, pool } = require('../server');

// Mock the pg pool so tests don't need a real database
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const mockPool = new Pool();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // Clean up
});

// ─── Health Check ───────────────────────────────────────────────
describe('GET /health', () => {
  test('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// ─── GET /api/tasks ─────────────────────────────────────────────
describe('GET /api/tasks', () => {
  test('should return list of tasks', async () => {
    const fakeTasks = [
      { id: 1, title: 'Buy groceries', completed: false },
      { id: 2, title: 'Do laundry', completed: true },
    ];
    mockPool.query.mockResolvedValueOnce({ rows: fakeTasks });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe('Buy groceries');
  });

  test('should return empty array when no tasks', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('should return 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB connection failed'));

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('DB connection failed');
  });
});

// ─── POST /api/tasks ────────────────────────────────────────────
describe('POST /api/tasks', () => {
  test('should create a new task', async () => {
    const newTask = { id: 1, title: 'New Task', completed: false };
    mockPool.query.mockResolvedValueOnce({ rows: [newTask] });

    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.completed).toBe(false);
  });

  test('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('should return 400 if title is empty string', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });
});

// ─── PUT /api/tasks/:id ─────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {
  test('should update a task', async () => {
    const updatedTask = { id: 1, title: 'Updated Task', completed: true };
    mockPool.query.mockResolvedValueOnce({ rows: [updatedTask] });

    const res = await request(app)
      .put('/api/tasks/1')
      .send({ title: 'Updated Task', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.completed).toBe(true);
  });

  test('should return 404 if task not found', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'Ghost Task', completed: false });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});

// ─── DELETE /api/tasks/:id ──────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  test('should delete a task', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });

  test('should return 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('Delete failed'));

    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(500);
  });
});
