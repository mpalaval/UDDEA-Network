document.addEventListener('DOMContentLoaded', () => {
    cargarClubes(1);
});

async function cargarClubes(leagueId) {
    const contenedorEntidades = document.querySelector('.lista-entidades');
    if (!contenedorEntidades) return;

    try {
        const respuesta = await fetch(`/api/equipos?league=${leagueId}`);
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || `HTTP ${respuesta.status}`);
        }

        const payload = await respuesta.json();
        const clubes = payload.datos?.team || [];

        renderizarClubes(clubes, contenedorEntidades);
    } catch (error) {
        console.error('Error al cargar clubes de BeSoccer:', error);
        contenedorEntidades.innerHTML = `
            <p class="texto-secundario mensaje-formulario--error">
                No se pudieron cargar las entidades deportivas (${error.message}).
            </p>
        `;
    }
}

function renderizarClubes(clubes, contenedor) {
    if (!Array.isArray(clubes) || clubes.length === 0) {
        contenedor.innerHTML = '<p class="texto-secundario">No se encontraron entidades.</p>';
        return;
    }

    // Vaciamos las tarjetas estáticas anteriores
    contenedor.innerHTML = '';

    // Mostramos los primeros 6 para mantener el equilibrio visual del diseño
    const seleccion = clubes.slice(0, 6);

    seleccion.forEach(club => {
        const nombre = club.fullName || club.nameShow || 'Club deportivo';
        const escudo = club.shield_png || club.shield_big || club.shield;
        const iniciales = club.short_name || 'FC';

        const articulo = document.createElement('article');
        articulo.className = 'tarjeta entidad';

        articulo.innerHTML = `
            <div class="cabecera-tarjeta">
                <span class="etiqueta">Clubes</span>
                <button
                    type="button"
                    class="boton-guardar"
                    aria-label="Guardar ${nombre}"
                    aria-pressed="false"
                >
                    <img
                        src="../assets/images/Vector_Bookmark.png"
                        alt=""
                        width="14"
                        height="14"
                    >
                </button>
            </div>

            <header class="identidad-entidad">
                <span class="icono-entidad" aria-hidden="true" style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img
                        src="${escudo}"
                        alt=""
                        width="26"
                        height="26"
                        style="object-fit: contain;"
                        onerror="this.style.display='none'; this.parentElement.textContent='${iniciales}';"
                    >
                </span>
                <div>
                    <h3>${nombre}</h3>
                    <p class="texto-secundario">
                        España · Club profesional
                    </p>
                </div>
            </header>

            <p>
                Metodología, cantera y seguimiento de talento en competición oficial.
            </p>
            <p class="especialidad-entidad">
                Estructura deportiva · Cantera
            </p>

            <footer class="acciones-entidad">
                <button
                    type="button"
                    class="boton-secundario"
                    aria-pressed="false"
                >
                    <img
                        src="../assets/images/Vector_Plus.png"
                        alt=""
                        width="12"
                        height="12"
                    >
                    <span>Seguir</span>
                </button>

                <button type="button" class="boton-texto">
                    <span>Ver entidad</span>
                    <img
                        src="../assets/images/Vector_Arrow_Top_Right.png"
                        alt=""
                        width="12"
                        height="12"
                    >
                </button>
            </footer>
        `;

        contenedor.appendChild(articulo);
    });
}