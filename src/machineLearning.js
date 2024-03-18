const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const { indexOfMaxNumber } = require('./utils.js');

// Fungsi untuk memuat model dari file sistem
const loadModel = async () => {
  // Mendefinisikan URL model
  const modelUrl = tf.io.fileSystem(
    path.join(process.cwd(), 'src', 'modelML', 'model.json'),
  );
  // Memuat metadata model
  const metadata = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(),'src', 'modelML', 'metadata.json'),
      { encoding: 'utf-8' },
    ),
  );

  // Memuat model menggunakan TensorFlow.js
  const model = await tf.loadLayersModel(modelUrl);
  // Menambahkan kelas-kelas dari metadata ke model
  model.classes = metadata.labels;

  return model;
};

// Fungsi untuk melakukan prediksi menggunakan model
const predict = async (model, image) => {
  // Melakukan prediksi pada gambar
  const result = await model.predict(image).data();
  // Mencari indeks dengan nilai tertinggi dari hasil prediksi
  const index = indexOfMaxNumber(result);

  return model.classes[index]; // Mengembalikan kelas hasil prediksi
};

// Fungsi untuk mentransformasi gambar sebelum diproses oleh model
const transformImage = (image) => {
  return tf.node
    .decodeImage(image, 3) // Mendekode gambar menjadi tensor
    .expandDims() // Menambahkan dimensi batch
    .resizeNearestNeighbor([224, 224]) // Mengubah ukuran gambar menjadi 224x224
    .div(tf.scalar(127)) // Normalisasi nilai piksel
    .sub(tf.scalar(1)); // Normalisasi nilai piksel
};

// Mengekspor fungsi-fungsi agar dapat digunakan di file lain
module.exports = { transformImage, loadModel, predict };
