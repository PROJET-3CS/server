FROM node:14.16.0-alpine3.13

# RUN addgroup app && adduser -S -G app app
# USER app
RUN apk update && apk add bash

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000 

CMD ["npm", "start"]
