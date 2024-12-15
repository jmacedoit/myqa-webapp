FROM --platform=linux/amd64 node:16-alpine3.17 as builder

RUN apk --no-cache add --virtual .builds-deps build-base python3

WORKDIR /usr/src

COPY package*.json ./
RUN npm install

COPY . ./

RUN NODE_ENV=production npm run build

FROM --platform=linux/amd64 node:16-alpine3.16

RUN apk add --no-cache python3 build-base

WORKDIR /usr/src

COPY --from=builder /usr/src/package*.json ./
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/config ./config
COPY --from=builder /usr/src/static ./static

RUN npm install

#Production mode was messiing with the styles
#CMD NODE_ENV=production npm run serve

CMD npm run serve
