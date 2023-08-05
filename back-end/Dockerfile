FROM node:20

WORKDIR /usr/src/app/

COPY ./*.json ./

RUN npm install


RUN apt-get update && apt-get install coreutils

RUN apt-get install xdg-utils -y

RUN npm install -g concurrently

EXPOSE 3000

EXPOSE 5555

# ENTRYPOINT ["sh", "-c", "trap 'exit' INT TERM; concurrently 'npx prisma migrate dev' 'npx prisma generate' 'npm run start:dev' "]

CMD npx prisma generate && npx prisma migrate dev && npm run start:dev