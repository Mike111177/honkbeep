FROM node:16-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json tsconfig.json assets.d.ts yarn.lock .yarnrc .yarnrc.yml ./
ADD .yarn ./.yarn
ADD packages ./packages

RUN yarn install

RUN yarn --cwd ./packages/honkbeep-live-server/ run build:prod --env deploy --no-devtool

FROM base
COPY --from=builder /app/packages/honkbeep-live-server/build ./
CMD ["node", "./main.js"]




