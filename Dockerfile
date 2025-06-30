FROM node:alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN --mount=type=secret,id=supabase_url \
  --mount=type=secret,id=supabase_key \
  export NUXT_SUPABASE_URL=$(cat /run/secrets/supabase_url) && \
  export NUXT_SUPABASE_ANON_KEY=$(cat /run/secrets/supabase_key) && \
  npm run build

FROM node:alpine AS runner
WORKDIR /home/node
COPY --from=builder /app/.output .
RUN chown -R node:node /home/node
USER node
EXPOSE 3000
ENTRYPOINT [ "node", "server/index.mjs" ]