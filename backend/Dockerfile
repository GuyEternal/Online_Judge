FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /app/data/outputs
RUN mkdir -p /app/data/inputs
COPY package.json .
RUN npm install
COPY . .
RUN apk add openjdk17-jdk
RUN apk add build-base
RUN apk add --no-cache py3-pip
CMD [ "node", "server.js" ]
EXPOSE 3001