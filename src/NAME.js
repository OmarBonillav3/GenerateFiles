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

function generarNombreArchivo() {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const subnombre = subnombres[Math.floor(Math.random() * subnombres.length)];
  const numero = String(Math.floor(Math.random() * 900) + 100);

  return `${nombre} ${subnombre} ${numero}.pdf`;
}

module.exports = { generarNombreArchivo };
