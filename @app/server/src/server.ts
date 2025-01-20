import './init-dotenv';

import cors from 'cors';
import express, { Express } from 'express';

import handleError from './error-handler';
import connect from './providers/mysql';
import departmentRoutes from './routes/department.routes';
import departmentHistoryRoutes from './routes/department-history.routes';
import employeeRoutes from './routes/employee.routes';

const app: Express = express();
const port = Number(process.env.PORT ?? 4000);

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async (_req, res) => {
  res.json({ message: 'Welcome' });
});

app.get('/checkConnections', async (_req, res) => {
  try {
    const localTime = new Date().toLocaleString();
    res.json({
      serverTime: localTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});
app.use('/departments', departmentRoutes);
app.use('/employees', employeeRoutes);
app.use('/departments-history', departmentHistoryRoutes);

// Error handler middleware
app.use(handleError);

async function init() {
  try {
    await connect(); // Ejecuta la inicialización
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(
      "Error connecting to the database, can't initialise server",
      error
    );
    process.exit(1);
  }
}

init();
