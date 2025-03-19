# Compliance System Frontend

This repository contains the frontend code for the Compliance System, an internal tool built using React and Vite. Follow the steps below to set up and run the project locally or deploy it using Docker.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for containerized deployments)

## Getting Started

1. **Clone the Repository**  
    Clone the repository to your local machine using the following command:
    ```bash
    git clone https://github.com/Tech-AJVC/compliance-system-frontend.git
    ```

2. **Install Dependencies**  
    Install the required dependencies using npm or yarn:
    ```bash
    npm install
    ```
    Or, if you prefer yarn:
    ```bash
    yarn install
    ```

3. **Run the Development Server**  
    Start the development server to preview the application:
    ```bash
    npm run dev
    ```
    Or, with yarn:
    ```bash
    yarn dev
    ```
    The application will be available at `http://localhost:5173` by default.

## Building for Production

To create a production build of the application, run:
```bash
npm run build
```
Or, with yarn:
```bash
yarn build
```
The build files will be generated in the `dist` directory.

## Docker Deployment

To deploy the application using Docker, follow these steps:

1. **Build the Docker Image**  
    Build the Docker image using the provided `Dockerfile`:
    ```bash
    docker build -t compliance-system-frontend .
    ```

2. **Run the Docker Container**  
    Start a container from the built image:
    ```bash
    docker run -d -p 80:80 compliance-system-frontend
    ```
    The application will be accessible at `http://localhost`.

3. **Stop the Container**  
    To stop the running container, use:
    ```bash
    docker ps
    docker stop <container_id>
    ```

## Linting and Formatting

This project includes ESLint for linting and Prettier for code formatting. To run lint checks, use:
```bash
npm run lint
```
Or, with yarn:
```bash
yarn lint
```

## Internal Use Only

This project is an internal tool and is not intended for public use or distribution. Please ensure proper authorization before accessing or modifying the codebase.
