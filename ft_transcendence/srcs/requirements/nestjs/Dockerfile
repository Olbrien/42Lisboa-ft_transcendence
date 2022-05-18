FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY /conf/package*.json ./

# Just doing npm@latest doesn't install the necessary dependencies.
# You need to npm install it first then upgrade it.
RUN npm install
RUN npm install -g npm@latest

# Bundle app source
COPY /conf/ .

RUN npm run build

CMD [ "node", "dist/main" ]