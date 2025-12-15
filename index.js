const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());

// Crear carpetas para archivos subidos y salidas
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
  const input = req.file.path;
  const output = `outputs/${Date.now()}.mp3`; // cambiar extensión según necesites

  const ffmpegPath = `"C:/ffmpeg/bin/ffmpeg.exe"`; // ruta de tu FFmpeg

  exec(`${ffmpegPath} -i ${input} ${output}`, (error) => {
    if (error) {
      return res.status(500).send("Error al convertir");
    }

    // Descargar el archivo convertido
    res.download(output, () => {
      fs.unlinkSync(input);
      fs.unlinkSync(output);
    });
  });
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});
