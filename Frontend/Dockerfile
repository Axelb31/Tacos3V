# --- Build (Assets statiques) ---
FROM alpine:latest AS builder
WORKDIR /app
COPY index.html ./

# --- High-Performance Web Server ---
FROM nginx:alpine AS runner
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]