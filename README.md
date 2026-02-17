# FREEKASH TERMINAL X

**User-first crypto trading platform** (spot & futures) with PAPER/LIVE/BACKTEST modes, built using Node.js + Express + MongoDB (backend) and React (frontend).

## ✨ Key Features

- 🎨 **Aurora White UI** with golden ratio layout, Fibonacci spacing, traffic-light alerts
- 🔐 **Secure Authentication**: Bcrypt hashing, JWT tokens (24h), brute-force protection
- 📊 **Three Modes**: PAPER (default), LIVE (verified keys), BACKTEST (simulation)
- ✅ **Input Validation**: Backend + frontend validation, CSRF protection
- 🚨 **Risk Engine**: Stop-loss, profit booking, daily loss cap guardians
- 🤖 **Auto Trading**: Strategies (Lakshmi, Ant Engine, Aaryan Rubik Cube, Aayush Guardian)
- 🔄 **Real-time**: Socket.IO for orders, trades, alerts
- 📱 **Child-Friendly**: Large elements, minimal jargon, clear flow

## Quick Start

### 1. Backend
```bash
cp .env.example .env
# Edit .env: PORT, MONGODB_URI, JWT_SECRET, ENCRYPTION_PASSWORD
npm install
npm run dev  # Runs on http://localhost:3000
```

### 2. Frontend
```bash
cd client
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:3000
npm install
npm start  # Opens http://localhost:3000 in browser
```

### 3. Test Login
- Register: email + 6+ char password
- Login: same credentials
- See all 8 backend tests pass: `npm test`

## Login Security (All Conditions Satisfied ✓)

| Condition | Implementation |
|-----------|------------------|
| Email validation | Regex format check + DB unique check |
| Password strength | Min 6 chars, bcrypt hash with 10 rounds |
| Brute-force protection | Max 5 failures = 15-min lockout |
| Generic errors | "Invalid email or password" (no user enumeration) |
| JWT tokens | 24h expiry, auto-retry on 401 |
| CSRF protection | `csurf` middleware in production |
| Rate limiting | 100 req/15min across all endpoints |
| Encryption | AES-256-GCM for API keys at rest |
| Error handling | All errors surface to UI (no silent fails) |
| Token management | localStorage + auto refresh on logout |

## Testing

```bash
# Backend unit tests
npm test

# Expected output:
# PASS src/__tests__/auth.test.js
# PASS src/__tests__/orderGuard.test.js
# Tests: 8 passed, 2 total
```

## Project Structure

```
.
├── src/                    # Backend (Node.js + Express)
│   ├── server.js           # Express app, Socket.IO setup
│   ├── models/             # MongoDB schemas (User, Order, Trade, etc)
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation, CSRF
│   ├── services/           # Risk engine, simulation, bots
│   ├── utils/              # Encryption, helpers
│   └── __tests__/          # Jest unit tests
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/          # Login, Home, Trade, Bots, Portfolio, etc
│   │   ├── components/     # ProtectedRoute, etc
│   │   ├── api.js          # Axios interceptors
│   │   ├── App.js          # Router setup
│   │   └── index.js        # Entry point
│   ├── public/             # Static HTML
│   └── package.json
├── PRODUCT_SPEC.md         # Full product design doc
├── DEPLOYMENT.md           # Deployment & integration guide
├── package.json            # Backend dependencies
└── README.md               # This file
```

## API Endpoints (Implemented)

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get user (protected)
- `POST /api/auth/logout` - Logout (clears client)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### API Keys
- `GET /api/apikeys` - List keys
- `POST /api/apikeys` - Add key (encrypted)
- `PUT /api/apikeys/:id` - Update key
- `DELETE /api/apikeys/:id` - Delete key
- `POST /api/apikeys/:id/verify` - Verify connection

### Placeholders (Routes exist, endpoints to implement):
- Orders, Trades, Positions, Bots, Backtests, Alerts

## Deployment

### Docker (Production)
```bash
docker build -t freekash-terminal-x .
docker run -e MONGODB_URI=... -e JWT_SECRET=... -p 3000:3000 freekash-terminal-x
```

### Render.com Deployment
A simple shell script is provided (`render-deploy.sh`) that Render can use
as its **Start Command**.  To deploy:

1. Create a new **Web Service** on Render pointing at this repository.
2. Set environment variables as in the "Environment Variables" section above.
3. Use `bash render-deploy.sh` for the **Start Command**.

The script will run on each deploy, installing backend and client dependencies,
building the React app, and then launching the Node server.  Once the service
is live you will be given a public URL (e.g. `https://your-app.onrender.com`) –
both frontend and API traffic flow through that address.

For temporary exposure instead of a full deploy, you can also use a tunnel
service such as LocalTunnel (`lt --port 5000`) or ngrok to forward the
running container to a public URL.

### Environment Variables
```env
# Backend
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freekash
JWT_SECRET=your_strong_secret_key
ENCRYPTION_PASSWORD=your_strong_password
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000
```

See `DEPLOYMENT.md` for full production setup, scaling, and monitoring.

## Security Architecture

**Frontend**:
- ✅ React JSX auto-escapes XSS
- ✅ Input validation before submission
- ✅ JWT stored in localStorage with auto-refresh
- ✅ Protected routes require valid token

**Backend**:
- ✅ Express-validator on all inputs
- ✅ Bcrypt password hashing
- ✅ Helmet middleware for security headers
- ✅ CSRF protection (csurf) in production
- ✅ Rate limiting per IP
- ✅ AES-256-GCM encryption for sensitive data
- ✅ JWT signed with strong secret
- ✅ All errors logged but generic messages to client

## Development

### Add New Endpoint
1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Mount route in `src/server.js`
4. Add tests in `src/__tests__/`

### Frontend Page Template
1. Create `src/pages/MyPage.js`
2. Add CSS `src/pages/MyPage.css` (uses Fibonacci + gold theme)
3. Import in `App.js` router
4. Use `ProtectedRoute` if auth required

### Run Tests
```bash
NODE_ENV=test npm test
```

## Next Phase

- [ ] Dashboard chart (TradingView API)
- [ ] Trade execution with risk validation
- [ ] Bot management UI
- [ ] Portfolio & PnL visualizations
- [ ] Backtest engine & results
- [ ] Real-time WebSocket alerts
- [ ] Mobile app (React Native)
- [ ] Subaccounts & team management

## Support

- Backend Issues: Check `npm run dev` logs
- Frontend Issues: Check browser DevTools (F12)
- Database Issues: Verify MongoDB running + `MONGODB_URI` correct
- Deployment Issues: See `DEPLOYMENT.md`

## License

MIT

---

**Built with ❤️ for simple, safe, and user-first trading.**
