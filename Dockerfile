FROM node:18

WORKDIR /app

COPY server/package*.json server/
RUN cd server && npm install

COPY server/ server/
RUN cd server && npm run build

EXPOSE 3001

CMD ["sh", "-c", "cd server && npm start"] 