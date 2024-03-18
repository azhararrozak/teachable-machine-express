const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { loadModel, transformImage, predict } = require("./src/machineLearning");

const app = express();

// Menggunakan middleware untuk mengizinkan CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Menggunakan middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer untuk menangani file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint root untuk menampilkan pesan sambutan
app.get("/", (req, res) => {
  res.send("Hello World");
});

let model;

// Load model saat server dimulai
loadModel().then(loadedModel => {
  model = loadedModel;
}).catch(error => {
  console.error('Gagal memuat model:', error);
});

// Menggunakan multer di endpoint /predict untuk menerima gambar
app.post("/predict", upload.single("image"), async (req, res) => {
  const image = req.file;

  // Memeriksa apakah gambar ada di body request
  if (!image) {
    return res.status(400).json({ error: 'Gambar tidak ditemukan dalam body permintaan' });
  }

  // Memeriksa apakah model sudah dimuat
  if (!model) {
    return res.status(500).json({ error: 'Model belum dimuat' });
  }

  try {
    const processedImage = transformImage(image.buffer); // Menggunakan buffer dari file
    const result = await predict(model, processedImage);
    res.json({ result });
  } catch (error) {
    console.error('Error prediksi:', error);
    res.status(500).json({ error: 'Prediksi gagal' });
  }
});

// Mendengarkan pada port 5000
app.listen(5000, () => {
  console.log("Server sedang berjalan pada port 5000");
});
