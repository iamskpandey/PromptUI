FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# The command to start the application
CMD ["npm", "start"]
