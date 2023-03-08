FROM node:19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY nodemon.json ./

COPY src ./src

RUN ls -a

EXPOSE 9000
CMD ["npm","run","serve"]
