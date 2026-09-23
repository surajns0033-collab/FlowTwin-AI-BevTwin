# FlowTwin AI - Production Multi-Stage Container for Google Cloud Run
# Runs Next.js 14 Web Application + Python 3.12 ADK Agent Runtime

# Stage 1: Build Next.js Application
FROM node:20-alpine AS web-builder
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm ci
COPY apps/web/ ./
RUN npm run build

# Stage 2: Production Runtime with Python ADK + Node.js
FROM python:3.11-slim AS runner
WORKDIR /app

# Install Node.js in production runner
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Google Cloud SDK Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Next.js Build & Node Modules
COPY --from=web-builder /app/.next ./.next
COPY --from=web-builder /app/node_modules ./node_modules
COPY --from=web-builder /app/package.json ./package.json
COPY --from=web-builder /app/public ./public

# Copy Python ADK Agents, Simulation Engine, and Data
COPY agents/ ./agents/
COPY simulation/ ./simulation/
COPY data/ ./data/
COPY knowledge/ ./knowledge/
COPY cloud/ ./cloud/

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start FlowTwin AI Production Server
CMD ["npm", "start", "--", "-p", "8080"]
