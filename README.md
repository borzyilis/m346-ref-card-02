
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



# Amazon Elastic Container Registry (ECR) Setup for ECS Deployment

## Overview:
Amazon ECR is a fully managed container registry that allows you to store, manage, and deploy Docker container images. In this documentation, we will cover how to push a Docker image to ECR and make it available for deployment to Amazon ECS.

## Prerequisites:
- An **AWS account** with permissions to create and manage ECR repositories and push images.
- **AWS CLI** installed and configured with the necessary credentials.
- **Docker** installed for building and pushing images.

## Steps:

### Step 1: Create an ECR Repository
To store your Docker images, you need to create an ECR repository.

1. **Login to AWS Console**.
2. Navigate to the **Amazon ECR** service.
3. Click on **Create Repository**.
4. Fill in the following details:
   - **Repository Name**: Choose a name, e.g., `my-app-repository`.
   - **Visibility Settings**: Choose **Private** (default).
   - **Tag Immutability**: You can leave this as **Mutable** to allow overwriting image tags.
   - **Encryption Settings**: Leave the default option (AES-256) unless you need specific encryption settings.
5. Click **Create Repository**.

![Alt text](images/Screenshot%202024-10-03%20095108.png)

### Step 2: Authenticate Docker to ECR
You need to authenticate Docker to push images to your private ECR repository.

Run the following command in the AWS CLI to log in to your ECR repository. Replace `region` and `account-id` with your respective values.

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```

Example for `us-east-1` region and account ID `366079775394`:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 366079775394.dkr.ecr.us-east-1.amazonaws.com
```

![Alt text](images/Screenshot%202024-10-03%20095151.png)
![Alt text](images/Screenshot%202024-10-03%20104709.png)

### Step 3: Build Your Docker Image
After authenticating, you need to build your Docker image if you haven't already. Navigate to your application directory (where your `Dockerfile` is located) and run:

```bash
docker build -t my-app .
```

### Step 4: Tag Your Docker Image
Tag the image with your ECR repository URL:

```bash
docker tag my-app:latest 366079775394.dkr.ecr.us-east-1.amazonaws.com/my-app-repository:latest
```

### Step 5: Push the Docker Image to ECR
Push your Docker image to the ECR repository:

```bash
docker push 366079775394.dkr.ecr.us-east-1.amazonaws.com/my-app-repository:latest
```

### Step 6: Verify Image in ECR
Once the image has been successfully pushed, verify that it is in your ECR repository by navigating to the ECR console. You should see the image in the **Images** section of your repository.

---

## Conclusion
You have now successfully created an ECR repository, authenticated Docker, and pushed your Docker image to Amazon ECR. This image is now ready to be used for ECS deployments.
