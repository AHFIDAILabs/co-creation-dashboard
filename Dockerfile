##############################
# 1. FRONTEND BUILD STAGE
##############################
FROM node:22-alpine AS frontend-builder


WORKDIR /app/frontend

# Install only necessary dependencies using package*.json
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./

# Build production frontend
RUN npm run build



##############################
# 2. BACKEND BUILD STAGE
##############################
FROM node:22-alpine AS backend-builder

WORKDIR /app/backend

# Install backend dependencies first for caching efficiency
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./



##############################
# 3. FINAL RUNTIME STAGE
##############################
FROM node:22-alpine AS runner

WORKDIR /app

# Copy backend build from builder
COPY --from=backend-builder /app/backend ./backend

# Copy frontend production build into backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure server.js can serve static frontend files
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "backend/server.js"]