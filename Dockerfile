FROM node:12

WORKDIR /home/pi/Code/template

COPY package*.json ./
#RUN nmp install

# Bundle app source
#COPY . .
COPY ./JS ./JS
COPY ./node_modules ./node_modules
COPY app.js .


EXPOSE 8000
CMD [ "node", "app.js" ]
