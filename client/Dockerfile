# ─────────────────────────────────────────────
# Client Dockerfile — Library Management UI
# Multi-stage: build with Node, serve with Nginx
# ─────────────────────────────────────────────

# ── Dependencies ───────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Dev Dependencies ──────────────────────────
FROM deps AS dev-deps
RUN npm ci

# ── Development ───────────────────────────────
FROM dev-deps AS development
ENV NODE_ENV=development
WORKDIR /app
EXPOSE 3000
# --host 0.0.0.0 makes Vite reachable from outside container
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3000"]

# ── Production Build ──────────────────────────
FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

# ── Production Serve (Nginx) ──────────────────
FROM nginx:alpine AS production
# Copy built React app to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom nginx config for SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
