FROM node:12

WORKDIR /home/pi/Code/template

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "node", "app.js" ]
