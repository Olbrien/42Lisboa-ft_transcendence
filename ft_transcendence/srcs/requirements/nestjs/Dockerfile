FROM node:latest

# Copy startup.sh
COPY /tools/startup.sh /tmp/

# Create app directory
WORKDIR /usr/src/app

# Copy app dependencies
COPY /app-volume/package*.json ./

# You need to npm install
RUN npm install

# Bundle app source
COPY /app-volume/ .

RUN npm run build

ENTRYPOINT ["sh","-c", "/bin/bash /tmp/startup.sh;"]