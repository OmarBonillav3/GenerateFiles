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

  // Placeholder
  "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Educación",
  "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Aprendizaje",
  "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Conocimiento",
];

// Función para obtener una imagen aleatoria
function obtenerImagenAleatoria() {
  return imagenesStock[Math.floor(Math.random() * imagenesStock.length)];
}

// Función para obtener múltiples imágenes
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
