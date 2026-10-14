const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// Carpeta raíz del proyecto
const ROOT = __dirname;


/* =========================================================
   TIPOS DE ARCHIVO
   ========================================================= */

const mimeTypes = {
    ".html": "text/html; charset=UTF-8",
    ".css": "text/css; charset=UTF-8",
    ".js": "text/javascript; charset=UTF-8",
    ".json": "application/json; charset=UTF-8",

    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",

    ".pdf": "application/pdf"
};


/* =========================================================
   SERVIDOR
   ========================================================= */

const server = http.createServer((req, res) => {

    // Elimina parámetros de la URL
    const requestUrl = req.url.split("?")[0];

    // Página principal
    let requestedPath =
        requestUrl === "/"
            ? "/index.html"
            : requestUrl;


    // Decodificar caracteres de la URL
    try {
        requestedPath = decodeURIComponent(requestedPath);
    }
    catch {
        res.writeHead(400);
        res.end("Solicitud incorrecta");
        return;
    }


    // Ruta absoluta del archivo
    const filePath = path.resolve(
        ROOT,
        "." + requestedPath
    );


    /* =====================================================
       SEGURIDAD BÁSICA
       Evita salir de la carpeta del proyecto
       ===================================================== */

    if (!filePath.startsWith(ROOT)) {

        res.writeHead(403, {
            "Content-Type": "text/plain; charset=UTF-8"
        });

        res.end("Acceso no permitido");

        return;
    }


    /* =====================================================
       LEER ARCHIVO
       ===================================================== */

    fs.stat(filePath, (error, stats) => {

        if (error) {

            mostrar404(res);

            return;
        }


        // Si la ruta apunta a una carpeta,
        // buscamos su index.html

        if (stats.isDirectory()) {

            const indexPath =
                path.join(filePath, "index.html");

            servirArchivo(indexPath, res);

            return;
        }


        servirArchivo(filePath, res);

    });

});


/* =========================================================
   SERVIR ARCHIVO
   ========================================================= */

function servirArchivo(filePath, res) {

    fs.readFile(filePath, (error, contenido) => {

        if (error) {

            mostrar404(res);

            return;
        }


        const extension =
            path.extname(filePath).toLowerCase();


        const contentType =
            mimeTypes[extension] ||
            "application/octet-stream";


        res.writeHead(200, {
            "Content-Type": contentType
        });


        res.end(contenido);

    });

}


/* =========================================================
   ERROR 404
   ========================================================= */

function mostrar404(res) {

    res.writeHead(404, {
        "Content-Type": "text/html; charset=UTF-8"
    });


    res.end(`
        <!DOCTYPE html>

        <html lang="es">

        <head>

            <meta charset="UTF-8">

            <title>404 · UDDEA Network</title>

        </head>

        <body>

            <h1>404</h1>

            <p>
                La página solicitada no existe.
            </p>

            <a href="/">
                Volver a UDDEA Network
            </a>

        </body>

        </html>
    `);

}


/* =========================================================
   INICIAR SERVIDOR
   ========================================================= */

server.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("   UDDEA Network v0.3");
    console.log("======================================");
    console.log("");
    console.log(`Servidor iniciado en:`);
    console.log(`http://localhost:${PORT}`);
    console.log("");
    console.log("Pulsa Ctrl + C para detenerlo.");
    console.log("");

});