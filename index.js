(async () => {
  const fs = require("fs");
  const path = require("path");
  const PDFDocument = require("pdfkit");
  const readline = require("readline");
  const { exec } = require("child_process");
  const axios = require("axios");
  const chalk = await import("chalk");

  // Importar las constantes de Preguntas.js
  const { preguntasRespuestas } = require("./src/P&R");
  const { obtenerImagenes } = require("./src/IMG");
  const { generarNombreArchivo } = require("./src/NAME");

  // Configuración de readline
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Descargar imagen desde URL
  async function descargarImagen(url) {
    try {
      const response = await axios({
        method: "GET",
        url,
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      console.error("Error descargando imagen:", error.message);
      return null;
    }
  }

  // Agregar imagen al inicio del PDF
  async function agregarImagenInicial(pdfDoc) {
    const imagenes = obtenerImagenes(1);
    try {
      const imagenBuffer = await descargarImagen(imagenes[0]);
      if (imagenBuffer) {
        const pageWidth =
          pdfDoc.page.width -
          pdfDoc.page.margins.left -
          pdfDoc.page.margins.right;
        const imgWidth = 300;
        const x = pdfDoc.page.margins.left + (pageWidth - imgWidth) / 2;

        pdfDoc.image(imagenBuffer, x, pdfDoc.y, { fit: [300, 200] });
        pdfDoc.moveDown(2);
      }
    } catch (error) {
      console.error("Error agregando imagen inicial:", error.message);
    }
  }
  // Generar archivos PDF
  async function generarArchivos(cantidadArchivos = 1) {
    for (let i = 0; i < cantidadArchivos; i++) {
      const nombreArchivo = generarNombreArchivo();

      const timestamp = Date.now();

      if (!preguntasRespuestas || preguntasRespuestas.length === 0) {
        console.error("Error: preguntasRespuestas es undefined o vacío.");
        continue;
      }

      const preguntasSeleccionadas = [...preguntasRespuestas]
        .sort(() => Math.random() - 0.5)
        .slice(0, 30 + Math.floor(Math.random() * 20));

      // --- Crear PDF ---
      const pdfDoc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Documento Educativo ${timestamp}`,
          Author: "KayrosLabs",
          Subject: "Material educativo variado",
          Creator: "KayrosLabs",
        },
      });

      const filePath = path.join(__dirname, "archivos", nombreArchivo);
      const stream = fs.createWriteStream(filePath);
      pdfDoc.pipe(stream);

      // --- Imagen inicial arriba de todo ---
      const [imagenBuffer] = await Promise.all(
        obtenerImagenes(1).map((url) => descargarImagen(url))
      );

      if (imagenBuffer) {
        const pageWidth =
          pdfDoc.page.width -
          pdfDoc.page.margins.left -
          pdfDoc.page.margins.right;
        const imgWidth = 300;
        const x = pdfDoc.page.margins.left + (pageWidth - imgWidth) / 2;

        const options = { fit: [300, 200] };
        const yBefore = pdfDoc.y;

        pdfDoc.image(imagenBuffer, x, yBefore, options);

        // Ajusta pdfDoc.y al final de la imagen
        pdfDoc.y = yBefore + options.fit[1] + 20; // 👈 20 px de margen extra
      }

      // --- Encabezado ---
      pdfDoc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Cuestionario", { align: "center" })
        .moveDown(0.5);

      pdfDoc
        .fontSize(10)
        .font("Helvetica")
        .text(`Creado el: ${new Date().toLocaleDateString()}`, {
          align: "center",
        })
        .moveDown(2);

      // --- Contenido principal ---
      for (let index = 0; index < preguntasSeleccionadas.length; index++) {
        const item = preguntasSeleccionadas[index];

        if (pdfDoc.y > pdfDoc.page.height - 100) {
          pdfDoc.addPage();
        }

        pdfDoc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(item.pregunta, { align: "left" })
          .moveDown(0.3);

        pdfDoc
          .fontSize(12)
          .font("Helvetica")
          .text(item.respuesta, { align: "justify" })
          .moveDown(1);
      }

      // --- Finalizar PDF ---
      pdfDoc.end();

      await new Promise((resolve, reject) => {
        stream.on("finish", () => {
          console.log(
            chalk.default.green(`Archivo generado: ${nombreArchivo}`)
          );
          resolve();
        });
        stream.on("error", reject);
      });
    }
  }

  // Borrar archivos
  function borrarArchivos(cantidadArchivos = 1) {
    return new Promise((resolve) => {
      const archivosEnCarpeta = fs.readdirSync(
        path.join(__dirname, "archivos")
      );

      if (archivosEnCarpeta.length === 0) {
        console.log(chalk.default.red("No hay archivos para borrar."));
        resolve();
        return;
      }

      const archivosABorrar = Math.min(
        cantidadArchivos,
        archivosEnCarpeta.length
      );

      for (let i = 0; i < archivosABorrar; i++) {
        const nombreArchivo = archivosEnCarpeta[i];
        const rutaArchivo = path.join(__dirname, "archivos", nombreArchivo);
        fs.unlinkSync(rutaArchivo);
        console.log(
          chalk.default.green(`El archivo ${nombreArchivo} ha sido borrado.`)
        );
      }
      resolve();
    });
  }

  // Abrir carpeta "archivos"
  function abrirCarpeta() {
    const rutaCarpeta = path.join(__dirname, "archivos");
    let comando;

    if (process.platform === "win32") {
      comando = `start "" "${rutaCarpeta}"`;
    } else if (process.platform === "darwin") {
      comando = `open "${rutaCarpeta}"`;
    } else {
      comando = `xdg-open "${rutaCarpeta}"`;
    }

    exec(comando, (error) => {
      if (error) {
        console.error(chalk.default.red("Error al abrir la carpeta:", error));
      }
    });
  }

  // Menú interactivo
  function mostrarMenu() {
    console.log("\n\n" + chalk.default.blue`============================`);
    console.log(chalk.default.blue`  Generador de Archivos  `);
    console.log(chalk.default.blue`============================`);
    console.log(chalk.default.yellow`Seleccione una opción:`);
    console.log(chalk.default.yellow`1. Generar archivos`);
    console.log(chalk.default.yellow`2. Borrar archivos`);
    console.log(chalk.default.yellow`3. Abrir carpeta de archivos`);
    console.log(chalk.default.yellow`4. Salir`);

    rl.question(
      chalk.default.cyan("Ingrese el número de la opción: "),
      (opcion) => {
        switch (opcion) {
          case "1":
            rl.question(
              chalk.default.cyan("Ingrese la cantidad de archivos a generar: "),
              (cantidad) => {
                generarArchivos(parseInt(cantidad)).then(mostrarMenu);
              }
            );
            break;
          case "2":
            rl.question(
              chalk.default.cyan("Ingrese la cantidad de archivos a borrar: "),
              (cantidad) => {
                borrarArchivos(parseInt(cantidad)).then(mostrarMenu);
              }
            );
            break;
          case "3":
            abrirCarpeta();
            mostrarMenu();
            break;
          case "4":
            console.log(
              chalk.default.green(
                "Gracias por usar el generador de archivos. ¡Adiós!"
              )
            );
            rl.close();
            break;
          default:
            console.log(
              chalk.default.red(
                "Opción no válida. Por favor, intente nuevamente."
              )
            );
            mostrarMenu();
            break;
        }
      }
    );
  }

  // Crear carpeta "archivos" si no existe
  if (!fs.existsSync(path.join(__dirname, "archivos"))) {
    fs.mkdirSync(path.join(__dirname, "archivos"));
  }

  // Mostrar menú al iniciar
  mostrarMenu();
})();
