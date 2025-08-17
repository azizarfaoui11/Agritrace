# Étape build CRA
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Étape serveur TypeScript
FROM node:20 AS server
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json tsconfig.json ./  # copier package.json + tsconfig.json
RUN npm install express @types/express typescript
COPY server.ts ./
RUN npx tsc server.ts --outDir dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
