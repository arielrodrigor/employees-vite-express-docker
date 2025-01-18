# Fullstack Technical Challenge - Project Initialization

This project is part of a technical challenge that demonstrates a robust architecture for a fullstack employee management application. The instructions below will guide you through the steps to initialize the project.

## Requirements

To run the project on a local machine, ensure you have the following installed:

- **Node.js**: Version >= 20
- **PNPM**: Version >= 6
- **Docker**: Docker Desktop or Docker Engine

## Configuration

### Docker

- You can add a `.env` file in the `docker` folder to change the default configuration.

## Getting Started

### Local Development

1. Initialize the monorepo:

   ```bash
   pnpm monorepo:init
   ```

2. Update environment files as needed.

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Build the project:

   ```bash
   pnpm build
   ```

6. Start the production server:
   ```bash
   pnpm start
   ```

### Docker Local Development

1. Build the development server:

   ```bash
   docker compose -f ./docker/compose/docker-compose.dev.yaml build
   ```

2. Start the development server:

   ```bash
   docker compose -f ./docker/compose/docker-compose.dev.yaml up
   ```

   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend**: [http://localhost:4000](http://localhost:4000)

   **Note for Windows users**: Use the `dev:windows` command in the Dockerfile if required.

### Notes on Linter

- The project is set up to run the linter in watch mode during development to enforce best practices. You can disable this by:
  - Removing the `eslint` plugin from `@app/client/vite.config.ts`.
  - Removing `eslint src --ext .js,.jsx,.ts,.tsx --fix &&` from `@app/server/nodemon.json`.

### MySQL Configuration

- On the first build of the container, MySQL will set up the initial users and database. Ensure the `.env` file has correct credentials:
  ```dotenv
  MYSQL_ROOT_PASSWORD=rootpassword
  MYSQL_DATABASE_NAME=fullstack_db
  MYSQL_USER=user
  MYSQL_PASSWORD=password
  ```
- If the `.env` file is misconfigured, stop and rebuild the containers:
  ```bash
  docker compose -f ./docker/compose/docker-compose.dev.yaml down --rmi=all --volumes
  ```

### Known Issues

- **Frontend Error**: If the client app encounters issues:

  - Remove the mounted `node_modules` from `docker-compose.dev.yaml`.
  - Rebuild the project, add `node_modules` back, and rebuild again.

- **Backend Error**: If the server app shows `Address already in use`:
  - Restart the containers.

### Docker Production Build

1. Build the production server:

   ```bash
   docker compose -f ./docker/compose/docker-compose.prod.yaml build
   ```

2. Start the production server:
   ```bash
   docker compose -f ./docker/compose/docker-compose.prod.yaml up
   ```

## Project Architecture

The project is structured as a monorepo using PNPM Workspaces, with separate folders for the backend and frontend applications.

### Directory Structure

```plaintext
.
├── @app
│   ├── client/         # Frontend (React + Vite + TailwindCSS)
│   ├── server/         # Backend (Express + TypeScript + Sequelize)
├── docker/             # Docker configurations
├── pnpm-workspace.yaml # PNPM workspace configuration
└── README.md           # Project documentation
```

## License

This project is shared under the **CC BY-NC 4.0** license. Usage is permitted for non-commercial purposes with proper attribution.
