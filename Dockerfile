# Multi-stage production build for Zaman Makinesi
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy full source
COPY . .

# Build production bundle to /app/dist
RUN npm run build

# Production web server stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard port 80 for Coolify
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
