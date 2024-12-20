FROM node:18-slim

WORKDIR /app/server

COPY server/ ./
RUN npm install

EXPOSE 3001

CMD ["npm", "start"] 