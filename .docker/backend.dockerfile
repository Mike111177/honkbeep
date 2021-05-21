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
COPY --from=builder /app/packages/honkbeep-live-server/package.json ./
RUN node -e 'const fs = require("fs"); const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8")); delete pkg.devDependencies; fs.writeFileSync("./package.json", JSON.stringify(pkg), "utf-8");'
RUN yarn install --production

#Configure DB
ENV PGHOST=localhost
ENV PGUSER=postgres
ENV PGPASSWORD=postgres
ENV HONKBEEP_PORT=3001
CMD ["node", "./main.js"]




