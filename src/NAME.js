// src/NAME.js

// Lista de posibles nombres
const nombres = [
  "Archivo",
  "Documento",
  "Informe",
  "Reporte",
  "Cuaderno",
  "Guía",
  "Manual",
  "Dossier",
];

// Lista de posibles subnombres
const subnombres = [
  "Matemático",
  "Histórico",
  "Científico",
  "Literario",
  "Técnico",
  "Educativo",
  "Filosófico",
  "Tecnológico",
];

// Función para generar nombre aleatorio
function generarNombreArchivo() {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const subnombre = subnombres[Math.floor(Math.random() * subnombres.length)];
  const numero = String(Math.floor(Math.random() * 900) + 100); // 3 dígitos (100–999)

  return `${nombre} ${subnombre} ${numero}.pdf`;
}

module.exports = { generarNombreArchivo };
