FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000

CMD ["node", "server.js"]
