FROM node:12

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

# Bundle app source
COPY . .

EXPOSE 9100
EXPOSE 9200

CMD npm start