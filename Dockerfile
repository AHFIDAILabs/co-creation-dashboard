# ================================
# 1. Build FRONTEND
# ================================
FROM node:18 AS build-frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend ./
RUN npm run build


# ================================
# 2. Build BACKEND + copy frontend dist
# ================================
FROM node:18 AS backend

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm install

COPY backend ./
COPY --from=build-frontend /app/frontend/dist ../frontend/dist

ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]