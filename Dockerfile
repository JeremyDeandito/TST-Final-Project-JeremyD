FROM node:18-slim

WORKDIR /app

COPY server/ .

RUN npm install

EXPOSE 3001

CMD ["npm", "start"] 