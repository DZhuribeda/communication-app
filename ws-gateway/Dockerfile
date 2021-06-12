FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 5001
EXPOSE 5002

CMD ["npm", "run", "dev"]
