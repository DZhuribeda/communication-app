FROM node:14

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./

RUN npm install && \
  npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
