FROM node:16
WORKDIR /app

COPY package.json tsconfig.json yarn.lock .yarnrc .yarnrc.yml ./
ADD .yarn ./.yarn
ADD packages ./packages

RUN yarn install