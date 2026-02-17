# FREEKASH TERMINAL X

## 1. Product Overview
FREEKASH TERMINAL X is a user-first, child-simple trading platform focusing on crypto spot and futures with optional toggles for traditional markets. It integrates multiple exchanges via CCXT and provides three operational modes (PAPER, LIVE, BACKTEST) with strict guardrails.

### Purpose
- Empower beginners to trade safely with automated and manual options
- Provide transparent risk management and alerting
- Support strategy research through backtesting and simulation

### Key Features
- Crypto spot & futures trading via exchange abstraction
- Modes: PAPER (default), LIVE (requires verification), BACKTEST
- Unified risk engine enforcing stop‑loss, profit booking, daily limits, etc.
- Manual and Auto trading pipelines with conflict resolution
- Alerts with traffic-light system visible across pages
- Multi-analysis inputs for decision-making
- Strategy suite with unique identities and traits
- Aurora White UI with golden ratio layout, large elements, and clear flow
- Settings CRUD with encryption and verification

## 2. User Journeys
### New User
1. Registers and lands in PAPER mode home dashboard.
2. Adds API keys via settings (optional) but stays in PAPER.
3. Explores charts, makes manual simulated trades or activates bots.
4. Modifies risk settings and notification preferences.
5. After practicing, verifies API keys and completes safety checklist to enable LIVE.

### Manual Trader
1. Navigates to Trade screen, reviews chart, sets order.
2. Order submission flows through risk engine; popup alerts appear on violation.
3. Positions appear in Portfolio with real-time PnL and risk state.

### Auto Trader
1. Opens Bots screen, enables one or more algorithms.
2. Bots run in chosen mode; bot status and performance shown.
3. User adjusts bot weights in settings and monitors alerts.

### Backtester
1. Enters Backtest Lab, selects instrument, timeframe, and parameters.
2. Runs simulation; equity curve and stats displayed.
3. Iterates by modifying rules or bot settings.

### Settings Manager
1. Adds/edits/deletes API keys; verifies connection.
2. Configures mode, leverage limits, instrument toggles.
3. Sets risk defaults, bot thresholds, and notification preferences.

## 3. UI/UX Mockups
Placeholder mockups are in `ui-mockups/` folder. Final designs should follow:
- Golden ratio split: 62% main area vs 38% right rail
- Aurora white theme with calm whites and subtle gold accents
- Big spacing based on Fibonacci sequence (e.g., 8px, 13px, 21px, 34px)
- Traffic-light statuses and large CTAs
- Flow: Understand → Decide → Act Safely

## 4. MongoDB Schemas
### User
```js
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  verified: Boolean,
  mode: { type: String, enum: ['PAPER','LIVE','BACKTEST'], default: 'PAPER' },
  settings: ObjectId, // ref to Settings
  createdAt: Date,
  updatedAt: Date
}
```

### APIKey
```js
{
  _id: ObjectId,
  userId: ObjectId,
  exchange: String,
  label: String,
  apiKey: String,      // encrypted
  apiSecret: String,   // encrypted
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Settings
```js
{
  _id: ObjectId,
  userId: ObjectId,
  risk: {
    stopLossPct: Number,
    takeProfitPct: Number,
    maxTradesPerDay: Number,
    dailyLossCap: Number,
    maxLeverage: Number,
    cooldownAfterLossStreak: Number,
  },
  bots: [{
    name: String,
    weight: Number,
    enabled: Boolean,
    trustThreshold: Number
  }],
  notifications: {
    popup: Boolean,
    sound: Boolean,
    telegram: Boolean,
    telegramChatId: String
  },
  instruments: {
    crypto: Boolean,
    nse: Boolean,
    bse: Boolean,
    nifty: Boolean,
    bankNifty: Boolean,
    commodities: Boolean,
    nasdaq: Boolean
  }
}
```

### Order
```js
{
  _id: ObjectId,
  userId: ObjectId,
  mode: String,
  exchange: String,
  symbol: String,
  side: String, // buy/sell
  type: String, // market/limit
  quantity: Number,
  price: Number,
  status: String, // pending/filled/cancelled/rejected
  createdAt: Date,
  updatedAt: Date
}
```

### Trade
```js
{
  _id: ObjectId,
  orderId: ObjectId,
  userId: ObjectId,
  entryPrice: Number,
  exitPrice: Number,
  quantity: Number,
  profitLoss: Number,
  fees: Number,
  liquidation: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Position
```js
{
  _id: ObjectId,
  userId: ObjectId,
  symbol: String,
  entryPrice: Number,
  quantity: Number,
  side: String,
  unrealizedPnL: Number,
  leverage: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### BotRun
```js
{
  _id: ObjectId,
  userId: ObjectId,
  botName: String,
  mode: String,
  startTime: Date,
  endTime: Date,
  status: String, // running/completed/paused
  trades: [ObjectId],
  performance: {
    pnl: Number,
    wins: Number,
    losses: Number,
    maxDrawdown: Number
  }
}
```

### Backtest
```js
{
  _id: ObjectId,
  userId: ObjectId,
  parameters: Object,
  results: {
    pnlCurve: [Number],
    stats: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Alert
```js
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // red/green/amber
  message: String,
  seen: Boolean,
  createdAt: Date
}
```

## 5. REST API Routes
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

// Users
GET /api/users/:id
PUT /api/users/:id

// API Keys
GET /api/apikeys
POST /api/apikeys
PUT /api/apikeys/:id
DELETE /api/apikeys/:id
POST /api/apikeys/:id/verify

// Settings
GET /api/settings
PUT /api/settings

// Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id

// Trades
GET /api/trades

// Positions
GET /api/positions

// Bots
GET /api/bots
POST /api/bots/:name/enable
POST /api/bots/:name/disable
PUT /api/bots/:name/weight

// Backtests
POST /api/backtests
GET /api/backtests

// Alerts
GET /api/alerts
PUT /api/alerts/:id/seen

// Mode Control
POST /api/mode/switch
```

### Socket Events
- `connect` / `disconnect`
- `order:update` (order status)
- `trade:executed` (new trade)
- `position:update` (position changes)
- `alert:new` (new alert popup)
- `bot:status` (bot running/paused)</p>

## 6. Trade Execution Pipeline Pseudocode
```js
function executeOrder(user, order) {
  // guard
  if (order.mode === 'LIVE' && !user.apiKeysVerified) {
    throw new Error('LIVE mode not permitted');
  }

  // risk check
  const riskResult = riskEngine.check(order, user.settings.risk);
  if (!riskResult.allowed) {
    emitAlert(user.id, 'red', riskResult.message);
    return rejectOrder(order, riskResult.message);
  }

  // route via CCXT
  const exchange = ccxt.byId(order.exchange);
  const response = exchange.createOrder(order.symbol, order.type, order.side, order.quantity, order.price);

  // record order
  saveOrder(order, response);

  // on fill -> create Trade record
}
```

Live guard: every path that sends to exchange must check `user.mode==='LIVE' && user.apiKeysVerified===true`.

## 7. Simulation Engine Rules
- Fees: configurable per exchange; default 0.1% taker, 0.05% maker
- Slippage: random within ±0.05% of market price for each fill
- Funding: for futures, periodic funding rate applied to positions
- Backtests use historical candle data; orders executed at open price of next bar with slippage and fee

## 8. Test Checklist
1. **Buy/sell correctness:** orders fill at expected prices, fees applied, positions updated
2. **Auto/manual conflict:** enabling AUTO disables MANUAL controls and vice versa
3. **Mode switching:** PAPER→LIVE requires verification, BACKTEST isolated
4. **SL/TP alerts:** triggers correctly in all modes with popups
5. **Backtest validity:** results match expected from simulation engine
6. **API key CRUD:** create, edit, delete, verify connection
7. **Risk rule enforcement** in pipeline
8. **Alert visibility** on navigation
9. **Error handling** surfaces in UI
10. **Mode guard** ensures LIVE trades only with verified keys

## 9. Logic Audit
### Common Fatal Bugs & Prevention
- **Accidental LIVE execution:** prevent by gating any exchange call behind `mode===LIVE && keys_verified`. Verified with unit tests and code reviews; add middleware.
- **Risk bypass via manual UI:** ensure manual orders call same service layer as bots, not direct exchange.
- **Unauthorized access to settings/APIs:** require authentication and authorization checks on every route.
- **Silent failures:** all errors propagate to client with user-friendly message; no `console.error` swallow.
- **Database inconsistencies:** use transactions where needed when creating orders+trades.
- **API key leak:** encrypt keys at rest, never return secrets via API.
- **Alert loss:** store alerts in DB until acknowledged; socket ensures delivery.
- **Simulation mismatch:** isolate simulation code; use deterministic random seed and compare to expected outcome.

---

This document serves as the core design and can be extended with architecture diagrams, sequence flows, and further detail as development progresses. Replace placeholder mockups with final images once available.