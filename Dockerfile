FROM node:18-slim

WORKDIR /app/server

COPY server/package*.json server/tsconfig.json ./
RUN npm install

COPY server/ ./
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"] 