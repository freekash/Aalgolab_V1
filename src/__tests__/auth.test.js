// auth.test.js - uses mocked User model to avoid DB dependency
const request = require('supertest');
const { app } = require('../../src/server');

// mock the User model used in controllers
jest.mock('../models/User', () => {
  const bcrypt = require('bcrypt');
  const users = [];
  class User {
    constructor(data) { Object.assign(this, data); }
    save() { users.push(this); return this; }
    comparePassword(password) { return bcrypt.compare(password, this.passwordHash); }
    static findOne(query) {
      return Promise.resolve(users.find(u => u.email === query.email));
    }
    static findById(id) { return Promise.resolve(users.find(u => u._id == id)); }
    static findByIdAndUpdate(id, updates) {
      const u = users.find(u => u._id == id);
      if (u) Object.assign(u, updates);
      return Promise.resolve(u);
    }
  }
  return User;
});

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const res = await request(app).post('/api/auth/register').send({ email, password });
    expect(res.statusCode).toBe(200);
    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
