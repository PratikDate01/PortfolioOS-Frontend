# Multi-stage build for Next.js web application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN npm ci

# Copy source files
COPY frontend/ ./frontend/

# Build packages
RUN npm run build --w @portfolio-os/web

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

RUN npm ci --only=production

COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs

EXPOSE 3000

CMD ["npm", "run", "start", "--w", "@portfolio-os/web"]
