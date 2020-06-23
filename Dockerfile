# --------------------------
# | Build target           |
# --------------------------
FROM node:14.4.0-alpine

WORKDIR /home/emoji-search

COPY package*.json ./
RUN npm install

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npm run build && \
    npm prune --production

# --------------------------
# | Production target      |
# --------------------------
FROM node:14.4.0-alpine
EXPOSE 80

WORKDIR /home/emoji-search

COPY --from=0 /home/emoji-search/node_modules ./node_modules
COPY --from=0 /home/emoji-search/dist ./dist

CMD node dist/main.js
