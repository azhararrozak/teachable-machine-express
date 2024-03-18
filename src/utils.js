// Fungsi untuk menemukan indeks dari nilai maksimum dalam array
const indexOfMaxNumber = (input) => {
  // Mengonversi input menjadi array
  const numbers = Array.from(input);

  // Memeriksa apakah input bukan array atau array kosong
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return -1; // Mengembalikan -1 jika tidak ada nilai maksimum yang ditemukan
  }

  // Fungsi reducer untuk mencari nilai maksimum dan indeksnya
  const reducer = (max, current, currentIndex) => (current > max.value
    ? { value: current, index: currentIndex } // Memperbarui nilai maksimum dan indeksnya jika ditemukan nilai yang lebih besar
    : max);

  // Menggunakan reducer untuk mendapatkan nilai maksimum dan indeksnya
  const { index } = numbers.reduce(reducer, { value: numbers[0], index: 0 });

  return index; // Mengembalikan indeks dari nilai maksimum
};

// Mengekspor fungsi indexOfMaxNumber agar dapat digunakan di file lain
module.exports = { indexOfMaxNumber };
