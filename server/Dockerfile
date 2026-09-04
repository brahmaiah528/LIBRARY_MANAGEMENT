# ─────────────────────────────────────────────
# Server Dockerfile — Library Management API
# Multi-stage build for dev & production
# ─────────────────────────────────────────────

# ── Dependencies (shared cache layer) ─────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Dev Dependencies ──────────────────────────
FROM deps AS dev-deps
RUN npm ci

# ── Development ───────────────────────────────
FROM dev-deps AS development
ENV NODE_ENV=development
WORKDIR /app
COPY . .
EXPOSE 5000
CMD ["npx", "nodemon", "--delay", "500ms", "server.js"]

# ── Production Builder ────────────────────────
FROM deps AS production
WORKDIR /app
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["node", "server.js"]

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
