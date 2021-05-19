FROM node:16 AS base
WORKDIR /app

FROM base AS builder
COPY package.json tsconfig.json yarn.lock .yarnrc .yarnrc.yml ./
ADD .yarn ./.yarn
ADD packages ./packages
RUN yarn workspaces focus honkbeep-live-client
RUN yarn run deploy:client

FROM nginx:alpine
COPY ./.docker/prod.nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build/client /usr/share/nginx/html