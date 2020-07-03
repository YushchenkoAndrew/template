FROM python:3

WORKDIR /home/pi/Code/template/python/SendMessageToDiscord

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./src/Main.py" ]
