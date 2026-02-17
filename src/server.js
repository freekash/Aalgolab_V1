require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const apiKeyRoutes = require("./routes/apikeys");
const settingsRoutes = require("./routes/settings");
const orderRoutes = require("./routes/orders");
const positionRoutes = require("./routes/positions");
const botRoutes = require("./routes/bots");
const backtestRoutes = require("./routes/backtests");
const alertRoutes = require("./routes/alerts");

const app = express();
const server = http.createServer(app);

// ✅ IMPORTANT for Codespaces / reverse proxies (cookies + secure)
app.set("trust proxy", 1);

// ✅ Run backend on 5000 (avoid conflict with CRA 3000)
const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";

// ✅ CORS: allow GitHub Codespaces + localhost
const corsOrigin = (origin, cb) => {
  if (!origin) return cb(null, true); // curl/postman
  const ok =
    origin.endsWith(".github.dev") ||
    origin.endsWith(".app.github.dev") ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("https://localhost:");
  cb(ok ? null : new Error("CORS blocked"), ok);
};

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

// ✅ Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ✅ CSRF only when you actually use cookies (keep it off for pure Bearer-token flows)
if (process.env.NODE_ENV === "production") {
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      },
    })
  );

  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
}

// ✅ Socket.IO with same CORS rule
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

// attach io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/apikeys", apiKeyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/bots", botRoutes);
app.use("/api/backtests", backtestRoutes);
app.use("/api/alerts", alertRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    ok: false,
    code: err.code || "SERVER_ERROR",
    message: err.message || "Internal Server Error",
  });
});

// connect & start
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      server.listen(PORT, HOST, () =>
        console.log(`✅ Backend listening on http://${HOST}:${PORT}`)
      );
    })
    .catch((err) => console.error("❌ Mongo connection error", err));
}

module.exports = { app, io };
