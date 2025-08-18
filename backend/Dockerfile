# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci --only=production

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production builder stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 vitality

# Copy built application
COPY --from=builder --chown=vitality:nodejs /app/dist ./dist
COPY --from=deps --chown=vitality:nodejs /app/node_modules ./node_modules
COPY --chown=vitality:nodejs package.json ./

USER vitality

EXPOSE 3001

CMD ["npm", "start"]