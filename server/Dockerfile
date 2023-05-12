FROM node:14

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD yarn install &&\
    yarn knex migrate:latest &&\
    node --max-old-space-size=8192 $(yarn bin)/ts-node main.ts