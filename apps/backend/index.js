const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para manejar JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Otras rutas
// Ejemplo: Ruta para obtener datos
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
