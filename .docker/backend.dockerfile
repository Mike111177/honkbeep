FROM node:16-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json tsconfig.json yarn.lock .yarnrc .yarnrc.yml ./
ADD .yarn ./.yarn
ADD packages ./packages

RUN yarn workspaces focus honkbeep-live-server

RUN yarn run deploy:server

FROM base
COPY --from=builder /app/build/server ./

#Configure DB
ENV PGHOST=localhost
ENV PGUSER=postgres
ENV PGPASSWORD=postgres
ENV HONKBEEP_PORT=3001
CMD ["node", "./main.js"]




