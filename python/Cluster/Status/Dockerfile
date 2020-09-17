FROM node:10-alpine

WORKDIR /home/node/Status/src

# Installing node packages
COPY package*.json ./
RUN npm install

# Installing python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN apk add --no-cache gcc build-base python3-dev
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN pip3 install --no-cache-dir rpi.gpio

# Bundle app source
COPY . .
RUN chmod +x ./Main.py

EXPOSE 18000
CMD [ "node", "app.js" ]
