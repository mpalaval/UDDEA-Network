// Node.js incluye estas herramientas: no necesitamos instalar paquetes todavía.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const publicDirectory = path.resolve(__dirname, '../src');
const apiKey = process.env.BESOCCER_API_KEY || '';
const port = Number(process.env.PORT || 3000);
const hasApiKey = Boolean(apiKey.trim() && apiKey !== 'PEGA_TU_CLAVE_AQUI');
const besoccerEndpoint = 'https://apiclient.besoccerapps.com/scripts/api/api.php';

const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

function sendJSON(response, status, data) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(data));
}

async function getTeams(response, url) {
    const league = url.searchParams.get('league') || '1';
    if (!/^[1-9][0-9]{0,9}$/.test(league)) {
        return sendJSON(response, 400, {
            error: 'league debe ser un identificador numérico positivo.'
        });
    }

    const dataDir = path.resolve(__dirname, 'data');
    const localFilePath = path.join(dataDir, `equipos_liga_${league}.json`);

    // Aseguramos que la carpeta server/data existe
    await fs.mkdir(dataDir, { recursive: true });

    // 1. Si BeSoccer no está configurado, intentamos servir el respaldo local directamente
    if (!hasApiKey) {
        try {
            const rawLocalData = await fs.readFile(localFilePath, 'utf-8');
            const parsedData = JSON.parse(rawLocalData);
            return sendJSON(response, 200, {
                origen: 'Archivo local (Respaldo)',
                league,
                datos: parsedData
            });
        } catch {
            return sendJSON(response, 503, {
                error: 'Sin clave de BeSoccer y sin archivo local para esta liga.'
            });
        }
    }

    // 2. Consulta a BeSoccer
    const apiURL = new URL(besoccerEndpoint);
    apiURL.search = new URLSearchParams({
        key: apiKey,
        req: 'teams',
        league,
        format: 'json',
        tz: 'Europe/Madrid'
    }).toString();

    try {
        const result = await fetch(apiURL, {
            signal: AbortSignal.timeout(15000),
            redirect: 'error'
        });

        if (!result.ok) {
            throw new Error(`Proveedor respondió con estado ${result.status}`);
        }

        const data = await result.json();
        const safeData = JSON.parse(JSON.stringify(data).split(apiKey).join('[clave oculta]'));

        // 3. Guardado en disco en formato JSON formateado
        await fs.writeFile(localFilePath, JSON.stringify(safeData, null, 2), 'utf-8');

        sendJSON(response, 200, {
            origen: 'BeSoccer (Guardado en local)',
            league,
            datos: safeData
        });
    } catch (error) {
        // 4. Si la red o la API fallan, intentamos recuperar el archivo local guardado previamente
        try {
            const rawLocalData = await fs.readFile(localFilePath, 'utf-8');
            const parsedData = JSON.parse(rawLocalData);
            sendJSON(response, 200, {
                origen: 'Archivo local (Recuperado tras fallo)',
                league,
                datos: parsedData
            });
        } catch {
            sendJSON(response, 502, {
                error: 'No se pudo conectar con BeSoccer ni existe una copia local guardada.'
            });
        }
    }
}

async function serveFile(response, pathname) {
    const decodedPath = decodeURIComponent(pathname);
    const relativePath = decodedPath === '/' ? 'html/Home.html' : decodedPath.slice(1);
    const filePath = path.resolve(publicDirectory, relativePath);
    const relative = path.relative(publicDirectory, filePath);
    const extension = path.extname(filePath).toLowerCase();

    // Solo exponemos HTML, estilos, scripts e imágenes dentro de src.
    // .env, .git y el código del servidor quedan fuera de esta carpeta pública.
    if (relative.startsWith('..') || path.isAbsolute(relative) ||
        !/^(html|assets|js)[\\/]/.test(relative) || !contentTypes[extension]) {
        return sendJSON(response, 404, { error: 'Archivo no encontrado.' });
    }

    try {
        const file = await fs.readFile(filePath);
        response.writeHead(200, {
            'Content-Type': contentTypes[extension],
            'X-Content-Type-Options': 'nosniff'
        });
        response.end(file);
    } catch {
        sendJSON(response, 404, { error: 'Archivo no encontrado.' });
    }
}

const server = http.createServer(async (request, response) => {
    try {
        if (request.method !== 'GET') {
            response.setHeader('Allow', 'GET');
            return sendJSON(response, 405, { error: 'Esta prueba solo admite consultas GET.' });
        }

        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/api/estado') {
            return sendJSON(response, 200, {
                servidor: 'activo',
                claveConfigurada: hasApiKey,
                aviso: 'Clave configurada no significa clave validada por BeSoccer.'
            });
        }
        if (url.pathname === '/api/equipos') {
            return await getTeams(response, url);
        }
        if (url.pathname === '/api/profesionales') {
            const filePath = path.resolve(__dirname, 'data/profesionales.json');
            try {
                const data = await fs.readFile(filePath, 'utf-8');
                return sendJSON(response, 200, JSON.parse(data));
            } catch {
                return sendJSON(response, 500, { error: 'No se pudo leer la lista de profesionales.'});
            }
        }
        if (url.pathname.startsWith('/api/')) {
            return sendJSON(response, 404, { error: 'Ruta de API no encontrada.' });
        }
        await serveFile(response, url.pathname);
    } catch {
        sendJSON(response, 400, { error: 'Petición no válida.' });
    }
});

server.on('error', error => {
    console.error(error.code === 'EADDRINUSE'
        ? 'Puerto ocupado. Cambia PORT en .env o cierra el servidor anterior.'
        : 'No se pudo iniciar el servidor.');
    process.exitCode = 1;
});

// Solo disponible en este ordenador durante el aprendizaje.
server.listen(port, '127.0.0.1', () => {
    console.log(`UDDEA: http://127.0.0.1:${port}/`);
    console.log(`Estado: http://127.0.0.1:${port}/api/estado`);
    console.log(`Equipos: http://127.0.0.1:${port}/api/equipos?league=1`);
});
