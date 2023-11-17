# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Leo
RUN curl -L https://raw.githubusercontent.com/AleoHQ/workshop/master/install.sh | sh
ENV PATH="/root/.leo/bin:${PATH}"

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run your app
CMD ["node", "app.js"]
