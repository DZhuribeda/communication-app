FROM python:3.9 AS development

RUN \
  apt-get update && apt-get install build-essential wget gnupg2 -y && \
  echo "deb https://deb.nodesource.com/node_14.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
  wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  apt-get update && \
  apt-get install -yqq nodejs=$(apt-cache show nodejs|grep Version|grep nodesource|cut -c 10-) yarn && \
  apt-mark hold nodejs && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development

COPY . .
RUN npm run build

FROM node:14.18 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN \
	set -x \
	&& apt-get update \
	&& apt-get install -y net-tools build-essential python python3-pip


COPY package*.json ./

RUN npm install --only=production

COPY . .
COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]