# Backend Production Dockerfile
FROM node:18-alpine AS base

# Install security updates
RUN apk update && apk upgrade

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S vitality -u 1001

# Change ownership of app directory
RUN chown -R vitality:nodejs /app

# Switch to non-root user
USER vitality

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["node", "src/main.js"]