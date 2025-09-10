function formatearTexto(texto) {
  // Corregir caracteres especiales
  return texto
    .replace(/‚/g, "₂")
    .replace(/c$/g, "") // Eliminar 'c' al final
    .replace(/\s+/g, " ") // Eliminar espacios múltiples
    .trim();
}

function generarTituloAleatorio() {
  const titulos = [
    "Compendio de Conocimiento General",
    "Enciclopedia de Datos Curiosos",
    "Manual Educativo",
    "Guía de Aprendizaje",
    "Compilación Académica",
    "Documento de Estudio",
    "Material Didáctico",
    "Recopilación Educativa",
  ];
  return titulos[Math.floor(Math.random() * titulos.length)];
}

module.exports = { formatearTexto, generarTituloAleatorio };
