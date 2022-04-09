FROM node:16-alpine as base

WORKDIR /app

FROM base as build

RUN apk update && \
    apk --no-cache add git

COPY *.json ./
COPY src ./src
COPY .eslintrc.yml ./

RUN npm audit
RUN npm install
RUN npm run build

RUN npm prune --production

FROM base as release

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

ENV NODE_ENV production
ENTRYPOINT [ "node", "/app/build/index.js" ]
