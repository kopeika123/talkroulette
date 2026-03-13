FROM node:22-bookworm-slim AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
