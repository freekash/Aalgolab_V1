// orderGuard.test.js - lightweight test using mocks
const request = require('supertest');
const { app } = require('../../src/server');

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
  }
  return User;
});

let token;
beforeAll(async () => {
  // register a user and login to get token
  await request(app).post('/api/auth/register').send({ email: 'guard@test.com', password: 'pass' });
  const res = await request(app).post('/api/auth/login').send({ email: 'guard@test.com', password: 'pass' });
  token = res.body.token;
});

describe('Live mode guard', () => {
  it('rejects orders in LIVE when keys not verified', async () => {
    const res = await request(app).post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ mode: 'LIVE', symbol: 'BTC/USDT', side: 'buy', type: 'market', quantity: 1 });
    expect(res.statusCode).toBe(501);
  });
});
