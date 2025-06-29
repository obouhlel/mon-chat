FROM node:alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine AS runner
WORKDIR /home/node
COPY --from=builder /app .
RUN chown -R node:node /home/node
USER node
EXPOSE 3000
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
