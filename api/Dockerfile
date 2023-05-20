# node:18.12.1-alpine3.17
#FROM node@sha256:b375b98d1dcd56f5783efdd80a4d6ff5a0d6f3ce7921ec99c17851db6cba2a93

# node:18.12.1-slim
FROM node:18.12.1-alpine

RUN apk update && apk add --no-cache curl

WORKDIR /app

COPY package.json .

COPY yarn.lock .

COPY tsconfig.json .

COPY src src

COPY prisma prisma

RUN yarn install
RUN yarn add @prisma/client
RUN npx prisma generate

RUN yarn build

CMD ["yarn start"]