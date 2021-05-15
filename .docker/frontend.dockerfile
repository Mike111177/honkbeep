FROM node:16 AS base
WORKDIR /app

FROM base AS builder
COPY package.json tsconfig.json assets.d.ts yarn.lock .yarnrc .yarnrc.yml ./
ADD .yarn ./.yarn
ADD packages ./packages
RUN yarn install
RUN yarn --cwd ./packages/honkbeep-live-client/ run build:prod

FROM nginx:alpine
ARG conf_file
COPY $conf_file /etc/nginx/nginx.conf
COPY --from=builder /app/packages/honkbeep-live-client/build /usr/share/nginx/html