# Multi-Stage Dockerfile for EventCraft AI
# Stage 1: Build all workspaces
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifest and workspaces
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all dependencies (clean)
RUN npm ci

# Copy source files
COPY shared/ ./shared/
COPY server/ ./server/
COPY client/ ./client/

# Build shared, server, and client
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy root package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled outputs
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Start unified production server
CMD ["node", "server/dist/index.js"]
