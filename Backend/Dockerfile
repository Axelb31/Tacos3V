FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev


FROM node:alpine AS runner
WORKDIR /app

USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node index.js menu.json ./

EXPOSE 3000
CMD ["node", "index.js"]
