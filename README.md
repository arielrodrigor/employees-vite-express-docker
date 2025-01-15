# Fullstack Assessment Project Documentation

This project is a fullstack web application designed for employee management. It uses React for the frontend, Express for the backend, Sequelize as the ORM, and PostgreSQL as the database.

---

## **Project Structure**

```
fullstack-assessment/
├── apps/
│   ├── backend/        # REST API (Node.js + Express + Sequelize)
│   └── frontend/       # Frontend (React + Vite)
├── packages/
│   └── shared/         # Shared code (if applicable)
├── docker/             # Docker configurations (optional)
├── pnpm-workspace.yaml # Workspaces configuration for pnpm
├── docker-compose.yml  # Container orchestration
├── README.md           # Project documentation
└── package.json        # Global monorepo configuration
```

---

## **Technologies Used**

1. **Frontend**: React + Vite
2. **Backend**: Express.js + Sequelize
3. **Database**: PostgreSQL
4. **ORM**: Sequelize
5. **Package Management**: PNPM Workspaces
6. **Containers**: Docker and Docker Compose

---

## **Today's Configuration Steps**

### 1. **Monorepo with PNPM**:

- Initialized the project using `pnpm` and configured workspaces.
- Created the `apps/backend` and `apps/frontend` directories.

### 2. **Backend**:

- Set up Express and Sequelize.
- Configured Sequelize migrations for the following tables:
  - `employees`
  - `departments`
  - `departments_history`

### 3. **Frontend**:

- Initialized the frontend using Vite and React.
- (Optional) Added TailwindCSS for styling.

### 4. **Docker**:

- Created `Dockerfile` for backend and frontend.
- Installed `pnpm` within the Docker containers.
- Configured `docker-compose.yml` to orchestrate the following services:
  - Backend
  - Frontend
  - PostgreSQL

### 5. **Database**:

- Configured PostgreSQL using Docker.
- Set up user, password, and database via `docker-compose.yml`.

### 6. **Verification**:

- Ensured backend, frontend, and database services are running correctly using Docker.

---

## **How to Run the Project**

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd fullstack-assessment
   ```

2. Build and start the containers:

   ```bash
   docker compose build
   docker compose up
   ```

3. Access the services:

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:5000](http://localhost:5000)

4. Verify the database:
   - Use a PostgreSQL client like `DBeaver` or `PgAdmin`.
   - Default credentials:
     - **User**: `user`
     - **Password**: `password`
     - **Database**: `fullstack_db`

---

## **Next Steps**

- Resolve internal issues related to library dependencies.
- Implement controllers and routes in the backend.
- Connect the frontend with the backend.
- Add further documentation as needed.
