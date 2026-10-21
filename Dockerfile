# Multi-stage/minimal secure container image
FROM node:22-alpine

WORKDIR /app

# Install production dependencies only using deterministic lockfile
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY src ./src

# Principle of least privilege: Run as non-root user
USER node

# Expose HTTP port
EXPOSE 3000

# Start hardened web service
CMD ["node", "src/server.js"]
