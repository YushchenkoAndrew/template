FROM node:10-alpine

WORKDIR $HOME/template/src

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
RUN rm -r C++/


EXPOSE 8000
CMD [ "node", "app.js" ]
