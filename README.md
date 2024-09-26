
# CI/CD Pipeline for React App using GitHub Actions and GitHub Container Registry (GHCR)

## Project Overview

This project implements a CI/CD pipeline for a React application using **GitHub Actions** and **GitHub Container Registry (GHCR)**. The pipeline is triggered by changes to the `main` branch and automates the process of building, testing, and pushing a Docker image to **GHCR**.

## Steps Implemented

### 1. **Set Up Dockerfile**

A `Dockerfile` was created in the root directory of the project to containerize the React app.

```Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. **Generate a Personal Access Token (PAT)**
To authenticate with **GitHub Container Registry (GHCR)**, a **Personal Access Token (PAT)** was generated with the following scopes:
- `write:packages`
- `read:packages`
- `repo` (if the repository is private)

The token was added as a secret named **`GHCR_PAT`** in the GitHub repository.

### 3. **Create GitHub Actions Workflow**

A GitHub Actions workflow (`.github/workflows/docker-image.yml`) was created to automate the CI/CD process. The workflow builds, tests, and pushes the Docker image to **GitHub Container Registry (GHCR)**.

Here’s the workflow configuration:

```yaml
name: CI/CD Pipeline for React App

on:
  push:
    branches:
      - main

jobs:
  ghcr:
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

    - name: Log in to GitHub Container Registry (using PAT)
      uses: docker/login-action@v2
      with:
        registry: ghcr.io  # Specify GitHub Container Registry
        username: ${{ github.actor }}  # GitHub username (actor running the workflow)
        password: ${{ secrets.GHCR_PAT }}  # Use the Personal Access Token (PAT)

    - name: Build and push Docker image to GitHub Container Registry
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository_owner }}/react-app:latest
```

### 4. **Log in to GHCR Using PAT**
- The workflow logs into **GitHub Container Registry (GHCR)** using the **Personal Access Token (PAT)**.
- The token is stored as a secret (`GHCR_PAT`) in the GitHub repository and used for authentication in the workflow.

### 5. **Build and Push Docker Image**
- After logging in to GHCR, the workflow builds the Docker image from the `Dockerfile` and pushes it to the **GitHub Container Registry** under the tag:
  ```
  ghcr.io/<github-username>/react-app:latest
  ```

### 6. **Verify the Docker Image in GitHub Packages**
- After the workflow runs, you can check the **Packages** section in your GitHub repository to verify that the Docker image has been successfully pushed.

## Result

- The Docker image for the React app is automatically built and pushed to **GitHub Container Registry (GHCR)** on each commit to the `main` branch.
- The **Personal Access Token (PAT)** is used for authentication, ensuring that the workflow can push images to GHCR without restrictions.
