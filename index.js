(async () => {
    const fs = require('fs');
    const path = require('path');
    const PDFDocument = require('pdfkit');
    const readline = require('readline');
    const chalk = await import('chalk');

    // Importar las constantes de Preguntas.js
    const { preguntasRespuestas } = require('./P&R');

    // Configuración de readline para entrada del usuario
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Función para generar archivos con preguntas y respuestas aleatorias
    function generarArchivos(cantidadArchivos = 1) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < cantidadArchivos; i++) {
                const nombreArchivo = `archivo_${Math.floor(Math.random() * 1000)}.pdf`;

                try {
                    if (!preguntasRespuestas || preguntasRespuestas.length === 0) {
                        console.error("Error: preguntasRespuestas es undefined o vacío.");
                        continue;
                    }

                    const preguntasRespuestasAleatorias = [...preguntasRespuestas].sort(() => Math.random() - 0.5);

                    const pdfDoc = new PDFDocument();
                    const stream = fs.createWriteStream(`archivos/${nombreArchivo}`);

                    stream.on('finish', () => {
                        console.log(chalk.default.green(`Archivo generado: ${nombreArchivo}`));
                        if (i === cantidadArchivos - 1) {
                            resolve();
                        }
                    });

                    pdfDoc.pipe(stream);

                    preguntasRespuestasAleatorias.forEach((item) => {
                        pdfDoc.text(`Pregunta: ${item.pregunta}`, {
                            align: 'left'
                        }).moveDown(0.5) // Espacio entre pregunta y respuesta
                        .text(`Respuesta: ${item.respuesta}`, {
                            align: 'left'
                        }).moveDown(1); // Espacio entre pares de pregunta y respuesta
                    });

                    pdfDoc.end();
                } catch (error) {
                    console.error("Error en la generación del archivo:", error);
                    reject(error);
                }
            }
        });
    }

    // Función para borrar archivos
    function borrarArchivos(cantidadArchivos = 1) {
        return new Promise((resolve, reject) => {
            const archivosEnCarpeta = fs.readdirSync(path.join(__dirname, 'archivos'));

            if (archivosEnCarpeta.length === 0) {
                console.log(chalk.default.red('No hay archivos para borrar.'));
                resolve();
                return;
            }

            const archivosABorrar = Math.min(cantidadArchivos, archivosEnCarpeta.length);

            for (let i = 0; i < archivosABorrar; i++) {
                const nombreArchivo = archivosEnCarpeta[i];
                const rutaArchivo = path.join(__dirname, 'archivos', nombreArchivo);
                fs.unlinkSync(rutaArchivo);
                console.log(chalk.default.green(`El archivo ${nombreArchivo} ha sido borrado.`));
            }
            resolve();
        });
    }

    // Función para mostrar el menú y obtener la opción del usuario
    function mostrarMenu() {
        console.log('\n\n' + chalk.default.blue`============================`);
        console.log(chalk.default.blue`  Generador de Archivos  `);
        console.log(chalk.default.blue`============================`);
        console.log(chalk.default.yellow`Seleccione una opción:`);
        console.log(chalk.default.yellow`1. Generar archivos`);
        console.log(chalk.default.yellow`2. Borrar archivos`);
        console.log(chalk.default.yellow`3. Salir`);

        rl.question(chalk.default.cyan('Ingrese el número de la opción: '), (opcion) => {
            switch (opcion) {
                case '1':
                    rl.question(chalk.default.cyan('Ingrese la cantidad de archivos a generar: '), (cantidad) => {
                        generarArchivos(parseInt(cantidad)).then(mostrarMenu);
                    });
                    break;
                case '2':
                    rl.question(chalk.default.cyan('Ingrese la cantidad de archivos a borrar: '), (cantidad) => {
                        borrarArchivos(parseInt(cantidad)).then(mostrarMenu);
                    });
                    break;
                case '3':
                    console.log(chalk.default.green('Gracias por usar el generador de archivos. ¡Adiós!'));
                    rl.close();
                    break;
                default:
                    console.log(chalk.default.red('Opción no válida. Por favor, intente nuevamente.'));
                    mostrarMenu();
                    break;
            }
        });
    }

    // Crear la carpeta "archivos" si no existe
    if (!fs.existsSync(path.join(__dirname, 'archivos'))) {
        fs.mkdirSync(path.join(__dirname, 'archivos'));
    }

    // Mostrar el menú al iniciar el script
    mostrarMenu();
})();