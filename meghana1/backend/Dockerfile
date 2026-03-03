# backend/Dockerfile
# Simple Node.js image for Express backend.

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]

