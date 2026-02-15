# Production Dockerfile for Render

FROM node:20-alpine

# Install tini (recommended for websocket stability)
RUN apk add --no-cache tini

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy project files
COPY . .

# Set production env
ENV NODE_ENV=production

# Render provides PORT automatically
ENV PORT=3000

# Expose port (Render uses this)
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
