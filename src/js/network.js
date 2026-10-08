document.addEventListener('DOMContentLoaded', () => {
    let profesionalesOriginales = [];

    const formulario = document.getElementById('formulario-profesionales');
    const contenedorLista = document.getElementById('lista-profesionales');
    const contadorResultados = document.getElementById('titulo-resultados');
    const resumenFiltros = document.getElementById('resumen-filtros');

    // Carga inicial de datos
    fetch('/api/profesionales')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(datos => {
            profesionalesOriginales = datos;
            aplicarFiltros();
        })
        .catch(err => {
            console.error('Error al cargar profesionales:', err);
            if (contenedorLista) {
                contenedorLista.innerHTML = `<p class="mensaje-formulario mensaje-formulario--error">Error al cargar profesionales (${err.message}).</p>`;
            }
        });

    // Eventos del formulario
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            aplicarFiltros();
        });

        formulario.addEventListener('change', () => {
            aplicarFiltros();
        });

        formulario.addEventListener('reset', () => {
            setTimeout(() => aplicarFiltros(), 10);
        });
    }

    function aplicarFiltros() {
        if (!contenedorLista) return;

        const formData = new FormData(formulario);
        const consultaTexto = (formData.get('consulta') || '').toLowerCase().trim();
        const experiencia = formData.get('experiencia') || '';
        const club = (formData.get('club') || '').toLowerCase().trim();
        const ubicacion = formData.get('ubicacion') || '';
        const categoria = formData.get('categoria') || '';
        const certificacion = formData.get('certificacion') || '';
        const idioma = formData.get('idioma') || '';
        const orden = formData.get('orden') || 'relevancia';

        // Checkboxes de roles seleccionados
        const rolesSeleccionados = Array.from(formulario.querySelectorAll('input[name="rol"]:checked'))
            .map(cb => cb.value);

        let filtrados = profesionalesOriginales.filter(item => {
            // Filtro por texto general (nombre, cargo o especialidad)
            if (consultaTexto) {
                const matchNombre = item.nombre.toLowerCase().includes(consultaTexto);
                const matchCargo = item.cargo.toLowerCase().includes(consultaTexto);
                const matchEspec = item.especialidades.some(e => e.toLowerCase().includes(consultaTexto));
                if (!matchNombre && !matchCargo && !matchEspec) return false;
            }

            // Filtro por rol
            if (rolesSeleccionados.length > 0 && !rolesSeleccionados.includes(item.rol)) {
                return false;
            }

            // Filtro por experiencia
            if (experiencia === '0-2' && item.experiencia > 2) return false;
            if (experiencia === '3-5' && (item.experiencia < 3 || item.experiencia > 5)) return false;
            if (experiencia === '6' && item.experiencia < 6) return false;

            // Filtro por club/organización
            if (club && !item.cargo.toLowerCase().includes(club)) return false;

            // Filtro por ubicación
            if (ubicacion && item.ubicacion !== ubicacion) return false;

            // Filtro por categoría
            if (categoria && item.categoria !== categoria) return false;

            // Filtro por certificación
            if (certificacion && item.certificacion !== certificacion) return false;

            // Filtro por idioma
            if (idioma && item.idioma !== idioma) return false;

            return true;
        });

        // Ordenación
        if (orden === 'experiencia') {
            filtrados.sort((a, b) => b.experiencia - a.experiencia);
        } else if (orden === 'nombre') {
            filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }

        renderizarResultados(filtrados);
    }

    function renderizarResultados(lista) {
        if (contadorResultados) {
            contadorResultados.textContent = `${lista.length} profesional${lista.length === 1 ? '' : 'es'}`;
        }

        if (resumenFiltros) {
            const activos = [];
            const formData = new FormData(formulario);
            if (formData.get('consulta')) activos.push(`Búsqueda: "${formData.get('consulta')}"`);
            const roles = Array.from(formulario.querySelectorAll('input[name="rol"]:checked')).map(c => c.value);
            if (roles.length) activos.push(`Roles: ${roles.join(', ')}`);
            if (formData.get('ubicacion')) activos.push(`País: ${formData.get('ubicacion')}`);

            resumenFiltros.textContent = activos.length ? activos.join(' · ') : 'Sin filtros activos.';
        }

        contenedorLista.innerHTML = '';

        if (lista.length === 0) {
            contenedorLista.innerHTML = '<p class="texto-secundario">No se encontraron profesionales con los criterios seleccionados.</p>';
            return;
        }

        lista.forEach(item => {
            const article = document.createElement('article');
            article.className = 'tarjeta profesional';
            article.dataset.id = item.id;

            const tagsHTML = item.especialidades.map(tag => `<li class="etiqueta">${tag}</li>`).join('');

            article.innerHTML = `
                <header class="cabecera-profesional">
                    <div class="avatar">
                        <img src="${item.avatar}" alt="" width="40" height="40">
                    </div>
                    <div class="identidad-profesional">
                        <h3>${item.nombre}</h3>
                        <p>${item.cargo}</p>
                        <p class="texto-secundario">${item.ciudad}</p>
                    </div>
                    <button type="button" class="boton-guardar" aria-label="Guardar perfil de ${item.nombre}" aria-pressed="false">
                        <img src="../assets/images/Vector_Bookmark.png" alt="" width="15" height="15">
                    </button>
                </header>

                <div class="contenido-profesional">
                    <p class="datos-profesional">
                        ${item.experiencia} años de experiencia · ${item.certificacion ? item.certificacion.toUpperCase() : 'Acreditado'}
                    </p>
                    <p>${item.descripcion}</p>
                    <ul class="especialidades lista-sin-estilo" aria-label="Especialidades de ${item.nombre}">
                        ${tagsHTML}
                    </ul>
                </div>

                <footer class="pie-profesional">
                    <p class="contactos-comunes texto-secundario">
                        <img src="../assets/images/Icono_Network.png" alt="" width="13" height="13">
                        ${item.contactosComunes} contactos en común
                    </p>
                    <div class="acciones-profesional">
                        <button type="button" class="boton-texto" data-accion="ver-perfil">Ver perfil</button>
                        <button type="button" class="boton-secundario" data-accion="conectar" aria-pressed="false">
                            <img src="../assets/images/Vector_Plus.png" alt="" width="12" height="12">
                            Conectar
                        </button>
                    </div>
                </footer>
            `;
            contenedorLista.appendChild(article);
        });
    }
});