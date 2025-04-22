# Step 1: Use the official Node.js image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or npm-shrinkwrap.json) into the container
COPY package*.json ./

# Step 4: Install dependencies inside the container
RUN npm install --production

# Step 5: Copy the rest of your application code into the container
COPY . .

# Step 6: Expose port (5000 is the default for your app)
EXPOSE 5000

# Step 7: Define the command to run your app
CMD ["npm", "start"]
