FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install underscore socket.io mongoose
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]

