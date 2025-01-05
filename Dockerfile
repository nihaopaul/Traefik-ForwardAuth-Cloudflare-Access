# Use an official Node.js runtime as the base image
FROM node:23-alpine

# change the working directory

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY build/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY build/ .

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]