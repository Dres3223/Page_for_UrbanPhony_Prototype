const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const app = express();
const PORT = process.env.PORT || 3000;

// Ruta de la carpeta de archivos subidos
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Verificar si la carpeta 'uploads' existe, si no, crearla
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
  console.log("Carpeta 'uploads' creada.");
}

// Middleware para servir archivos estáticos
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, "public")));

// Ruta para manejar la carga de archivos
app.post("/uploads", (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = UPLOADS_DIR;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error en la carga del archivo:", err);
      return res.status(500).send("Error al procesar el archivo");
    }

    if (!files.file) {
      return res.status(400).send("No se recibió ningún archivo");
    }

    console.log(`Archivo recibido: ${files.file[0].originalFilename}`);
    res.status(200).send("Archivo recibido correctamente");
  });
});

// Ruta para obtener la lista de archivos subidos
app.get("/api/files", (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer la carpeta de archivos" });
    }

    // Filtrar solo archivos WAV y CSV
    const validFiles = files.filter(
      (file) => file.endsWith(".wav") || file.endsWith(".csv")
    );
    res.json({ files: validFiles });
  });
});

// Ruta para servir el HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
