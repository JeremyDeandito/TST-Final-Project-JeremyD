FROM node:18-slim

WORKDIR /app

COPY server/ .

RUN npm install && \
    chmod +x node_modules/.bin/ts-node && \
    chown -R node:node .

USER node

EXPOSE 3001

CMD ["./node_modules/.bin/ts-node", "server.ts"] 