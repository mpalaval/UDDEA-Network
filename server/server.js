// server.js
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const publicDirectory = path.resolve(__dirname, '../src');
const dataDirectory = path.resolve(__dirname, 'data');
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

async function readLocalData(filename) {
    const filePath = path.join(dataDirectory, filename);
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function getTeams(response, url) {
    const league = url.searchParams.get('league') || '1';
    if (!/^[1-9][0-9]{0,9}$/.test(league)) {
        return sendJSON(response, 400, { error: 'league debe ser un identificador numérico positivo.' });
    }

    const localFileName = `equipos_liga_${league}.json`;
    await fs.mkdir(dataDirectory, { recursive: true });

    if (!hasApiKey) {
        const localData = await readLocalData(localFileName);
        if (localData) {
            return sendJSON(response, 200, { origen: 'Archivo local (Respaldo)', league, datos: localData });
        }
        return sendJSON(response, 503, { error: 'Sin clave de BeSoccer y sin archivo local para esta liga.' });
    }

    const apiURL = new URL(besoccerEndpoint);
    apiURL.search = new URLSearchParams({
        key: apiKey,
        req: 'teams',
        league,
        format: 'json',
        tz: 'Europe/Madrid'
    }).toString();

    try {
        const result = await fetch(apiURL, { signal: AbortSignal.timeout(15000) });
        if (!result.ok) throw new Error(`Proveedor respondió con estado ${result.status}`);

        const data = await result.json();
        const safeData = JSON.parse(JSON.stringify(data).split(apiKey).join('[clave oculta]'));

        await fs.writeFile(path.join(dataDirectory, localFileName), JSON.stringify(safeData, null, 2), 'utf-8');
        sendJSON(response, 200, { origen: 'BeSoccer (Guardado en local)', league, datos: safeData });
    } catch {
        const fallbackData = await readLocalData(localFileName);
        if (fallbackData) {
            return sendJSON(response, 200, { origen: 'Archivo local (Recuperado tras fallo)', league, datos: fallbackData });
        }
        sendJSON(response, 502, { error: 'No se pudo conectar con BeSoccer ni existe copia local.' });
    }
}

async function serveFile(response, pathname) {
    let relativePath = decodeURIComponent(pathname);
    if (relativePath === '/') relativePath = '/html/Homev2.html';
    
    // Si la ruta no tiene extensión, asumir .html en /html/
    if (!path.extname(relativePath) && !relativePath.startsWith('/api/')) {
        relativePath = `/html/${relativePath.replace('/', '')}.html`;
    }

    const filePath = path.resolve(publicDirectory, `.${relativePath}`);
    const relative = path.relative(publicDirectory, filePath);
    const extension = path.extname(filePath).toLowerCase();

    if (relative.startsWith('..') || path.isAbsolute(relative) || !contentTypes[extension]) {
        return sendJSON(response, 404, { error: 'Archivo no encontrado.' });
    }

    try {
        const file = await fs.readFile(filePath);
        response.writeHead(200, { 'Content-Type': contentTypes[extension], 'X-Content-Type-Options': 'nosniff' });
        response.end(file);
    } catch {
        sendJSON(response, 404, { error: 'Archivo no encontrado.' });
    }
}

const server = http.createServer(async (request, response) => {
    try {
        if (request.method !== 'GET') {
            response.setHeader('Allow', 'GET');
            return sendJSON(response, 405, { error: 'Método no permitido.' });
        }

        const url = new URL(request.url, 'http://localhost');

        if (url.pathname === '/api/estado') {
            return sendJSON(response, 200, { servidor: 'activo', claveConfigurada: hasApiKey });
        }
        if (url.pathname === '/api/equipos') {
            return await getTeams(response, url);
        }
        if (url.pathname === '/api/profesionales') {
            const data = await readLocalData('profesionales.json');
            return data ? sendJSON(response, 200, data) : sendJSON(response, 500, { error: 'Error al leer profesionales.' });
        }
        if (url.pathname === '/api/publicaciones') {
            const data = await readLocalData('publicaciones.json');
            return data ? sendJSON(response, 200, data) : sendJSON(response, 500, { error: 'Error al leer publicaciones.' });
        }
        if (url.pathname.startsWith('/api/')) {
            return sendJSON(response, 404, { error: 'Endpoint no encontrado.' });
        }

        await serveFile(response, url.pathname);
    } catch {
        sendJSON(response, 400, { error: 'Petición no válida.' });
    }
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Servidor UDDEA activo: http://127.0.0.1:${port}/`);
});