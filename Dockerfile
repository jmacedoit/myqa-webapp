FROM node:14.1.0-alpine3.11 as base

# Setup working directory
WORKDIR /usr/src

# Install
COPY package*.json ./
RUN npm install

# Copy remaining files
COPY . ./

# Bundle
RUN NODE_ENV=production npm run build

# Release
FROM node:14.1.0-alpine3.11 AS release
WORKDIR /usr/src
COPY --from=base /usr/src/node_modules ./node_modules
COPY --from=base /usr/src/package.json ./package.json
COPY --from=base /usr/src/config ./config
COPY --from=base /usr/src/dist ./dist

# Start server
CMD NODE_ENV=production npm run serve
