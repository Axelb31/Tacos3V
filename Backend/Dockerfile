FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY index.js menu.json ./

USER node
EXPOSE 3000
CMD ["node", "index.js"]
