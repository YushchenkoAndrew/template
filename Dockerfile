# Install dependencies only when needed
FROM alpine:latest AS deps
RUN apk add --update nodejs npm
RUN npm install -g npm@latest

WORKDIR /app
COPY package*.json ./
RUN npm i --frozen-lockfile

# Rebuild the source code only when needed
FROM alpine:latest AS builder
RUN apk add --update nodejs npm
RUN npm install -g npm@latest

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm i --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM alpine:latest AS runner
RUN apk add --update nodejs npm
RUN npm install -g npm@latest
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 8000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]

