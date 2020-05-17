# Use NodeJS base image
FROM node:13

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

RUN npm ci 

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "npm", "run", "dev" ]