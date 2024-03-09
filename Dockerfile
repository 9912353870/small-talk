FROM node
WORKDIR /src
RUN npm i nodemon -g
COPY package.json package.json
RUN npm install
RUN mv /src/node_modules /node_modules
COPY . .
CMD ["nodemon", "-L", "app.js"]