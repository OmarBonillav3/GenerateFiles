const path = require("path");

// URLs de imágenes de stock gratuitas (puedes agregar más)
const imagenesStock = [
  // Unsplash (imágenes educativas)
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400", // libros
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400", // educación
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400", // aprendizaje
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", // equipo estudio
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400", // profesor

  // Picsum (imágenes aleatorias)
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
  "https://picsum.photos/400/300?random=5",
  "https://picsum.photos/400/300?random=6",
  "https://picsum.photos/400/300?random=7",
  "https://picsum.photos/400/300?random=8",
  "https://picsum.photos/400/300?random=9",
  "https://picsum.photos/400/300?random=10",
  "https://picsum.photos/400/300?random=11",
  "https://picsum.photos/400/300?random=12",
  "https://picsum.photos/400/300?random=13",

];

function obtenerImagenAleatoria() {
  return imagenesStock[Math.floor(Math.random() * imagenesStock.length)];
}

function obtenerImagenes(cantidad = 3) {
  const imagenes = [];
  for (let i = 0; i < cantidad; i++) {
    imagenes.push(obtenerImagenAleatoria());
  }
  return imagenes;
}

module.exports = {
  imagenesStock,
  obtenerImagenAleatoria,
  obtenerImagenes,
};
