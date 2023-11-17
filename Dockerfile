# Step 1: Build the application
# Use a Node.js base image
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files (or package-lock.json if using npm)
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN yarn build

# Step 2: Serve the app using nginx
# Use an nginx base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
