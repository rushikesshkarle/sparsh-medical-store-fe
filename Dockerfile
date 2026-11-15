# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# sparsh-medical-fe — Vite + React SPA served by nginx.
#
# nginx serves the built app and proxies /api and /media to the backend, so the
# browser talks to ONE origin (no CORS needed). VITE_* values are BUILD-TIME:
# Vite inlines them, so they must be passed as --build-arg.
#
#   docker build -t sparsh-medical-fe .                      # same-origin (default)
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t sparsh-medical-fe .
# ─────────────────────────────────────────────────────────────────────────────

# ---- Stage 1: build the static assets -------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID=""
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# ---- Stage 2: serve with nginx --------------------------------------------
FROM nginx:1.27-alpine AS runtime
# BACKEND_URL is read at container start (nginx envsubst templates).
ENV BACKEND_URL=http://sparsh-medical-backend:8000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
