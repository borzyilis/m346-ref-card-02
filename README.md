# CI/CD Pipeline for React App using GitHub Actions and Docker Hub

## Project Overview
This project implements a CI/CD pipeline for a React application using **GitHub Actions** and **Docker Hub**. The pipeline is triggered by changes to the `main` branch and automates the process of building, testing, and pushing a Docker image to Docker Hub.

## Steps Implemented

1. **Set Up Dockerfile**
   - A `Dockerfile` was created in the root directory of the project to containerize the React app.
   
   ```Dockerfile
   FROM node:14
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]

1. **Create GitHub Actions Workflow**

A GitHub Actions workflow `.github/workflows/docker-image.yml` was created to automate the CI/CD process. The workflow builds and pushes the Docker image to Docker Hub whenever a change is pushed to the main branch.

```name: CI/CD Pipeline for React App

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Build React app
      run: npm run build

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/react-app:latest
```

## 3. Docker Hub Access Token Setup
Generated a Docker Hub access token with Read & Write access and added it to the GitHub repository's secrets.

## 4. GitHub Actions Workflow Trigger
Pushed changes to the main branch to trigger the GitHub Actions workflow.

## 5. Testing the Workflow
Verified that the workflow runs successfully by checking the GitHub Actions logs.
Confirmed that the Docker image was pushed to Docker Hub.

# Result

The Docker image for the React app is automatically built and pushed to Docker Hub on each commit to the main branch. The access token and permissions are correctly configured for secure access to Docker Hub.