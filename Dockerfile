FROM node:10-alpine

WORKDIR /home/node/template/src

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]
