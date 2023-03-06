# docker build . back:latest

# ------ BUILD ------
FROM node:19-alpine

WORKDIR /usr

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run prepare
RUN npm run build


# ------ RUN ------
FROM node:19-alpine
WORKDIR /usr

COPY package*.json ./
RUN npm install --only-production

COPY --from=0 /usr/build .
CMD ["npm", "run", "start:docker"]
