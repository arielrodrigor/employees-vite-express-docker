import mysql, { Pool } from 'mysql2/promise';

// const mysqlUser = process.env.MYSQL_USER;
// const mysqlPassword = process.env.MYSQL_PASSWORD;
const rootUser = 'root';
const rootPassword = process.env.MYSQL_ROOT_PASSWORD;

// Script SQL como una cadena
const sqlInitScript = `
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    contact_info JSON,
    hire_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    termination_date DATE,
    current_department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (current_department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS departments_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
`;

const con: Pool = mysql.createPool({
  host: 'mysql',
  user: rootUser,
  password: rootPassword,
  database: 'company_db',
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase(): Promise<void> {
  try {
    const connection = await con.getConnection();
    await connection.query(sqlInitScript); // Ejecuta el script SQL directamente
    connection.release();
    console.log('Database initialized with embedded SQL script');
  } catch (error) {
    console.error('Error executing SQL script:', error);
    throw error;
  }
}

async function connect(): Promise<void> {
  try {
    await initializeDatabase();
    console.log('MySQL connected and initialized!');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

export { con, connect };
