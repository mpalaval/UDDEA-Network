document.addEventListener('DOMContentLoaded', () => {
    const contenedorFeed = document.getElementById('publicaciones');
    const formularioPost = document.getElementById('formulario-publicacion');
    const textareaPost = document.getElementById('texto-publicacion');

    // 1. Cargar publicaciones desde la API local
    function cargarPublicaciones() {
        if (!contenedorFeed) return;

        fetch('/api/publicaciones')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(posts => renderizarPosts(posts))
            .catch(err => {
                console.error('Error al cargar feed:', err);
            });
    }

    function renderizarPosts(posts) {
        const cabeceraHTML = `
            <div class="cabecera-seccion">
                <h2>Publicaciones de la comunidad</h2>
                <span class="texto-secundario">Más recientes</span>
            </div>
        `;

        let htmlPosts = '';

        posts.forEach(post => {
            const mediaHTML = post.media ? `
                <div class="destacado-publicacion">
                    <p>Contenido Destacado</p>
                    <h4>${post.media.alt || 'Análisis táctico en profundidad'}</h4>
                    <p>Haz clic para ampliar la información</p>
                </div>
            ` : '';

            htmlPosts += `
                <article class="tarjeta publicacion" data-id="${post.id}">
                    <div class="autor-publicacion">
                        <div class="avatar">
                            <img src="${post.autorAvatar}" alt="${post.autorNombre}">
                        </div>
                        <div>
                            <h3><a href="Profile.html">${post.autorNombre}</a></h3>
                            <p>${post.autorCargo} · <span class="texto-secundario">${post.tiempo}</span></p>
                        </div>
                    </div>

                    <div class="contenido-publicacion">
                        <p>${post.contenido}</p>
                        ${mediaHTML}
                    </div>

                    <footer class="pie-publicacion">
                        <div class="texto-secundario">
                            <span>
                                <img src="../assets/images/Vector_Bookmark.png" alt="" width="12" height="12">
                                <strong class="count-likes">${post.likes}</strong> me gusta
                            </span>
                            <span>· ${post.comentarios} comentarios</span>
                            <span>· ${post.compartidos} compartidos</span>
                        </div>
                        <div class="acciones-publicacion">
                            <button type="button" class="btn-like">
                                <img src="../assets/images/Vector_Bookmark.png" alt="" width="13" height="13">
                                Me gusta
                            </button>
                            <button type="button" class="btn-comentar">
                                <img src="../assets/images/Vector_Search.png" alt="" width="13" height="13">
                                Comentar
                            </button>
                            <a href="Network.html" class="boton-conectar">
                                <img src="../assets/images/Vector_Plus.png" alt="" width="12" height="12">
                                Conectar
                            </a>
                        </div>
                    </footer>
                </article>
            `;
        });

        contenedorFeed.innerHTML = cabeceraHTML + htmlPosts;
        asignarEventosInteraccion();
    }

    function asignarEventosInteraccion() {
        if (!contenedorFeed) return;

        // Botón "Me gusta"
        contenedorFeed.querySelectorAll('.btn-like').forEach(boton => {
            let liked = false;
            boton.addEventListener('click', () => {
                const tarjeta = boton.closest('.publicacion');
                const countLikes = tarjeta ? tarjeta.querySelector('.count-likes') : null;
                if (!countLikes) return;

                liked = !liked;
                let actual = parseInt(countLikes.textContent, 10);
                countLikes.textContent = liked ? actual + 1 : actual - 1;
                boton.classList.toggle('activo', liked);
            });
        });
    }

    // 2. Crear nueva publicación en tiempo real
    if (formularioPost && textareaPost) {
        formularioPost.addEventListener('submit', (e) => {
            e.preventDefault();
            const texto = textareaPost.value.trim();

            if (!texto) return;

            const nuevoPostHTML = `
                <article class="tarjeta publicacion">
                    <div class="autor-publicacion">
                        <div class="avatar">
                            <img src="../assets/images/Avatar_Genérico_6.png" alt="Alejandro Martín">
                        </div>
                        <div>
                            <h3><a href="Profile.html">Alejandro Martín</a></h3>
                            <p>Analista Táctico · Candidato · <span class="texto-secundario">Justo ahora</span></p>
                        </div>
                    </div>

                    <div class="contenido-publicacion">
                        <p>${texto}</p>
                    </div>

                    <footer class="pie-publicacion">
                        <div class="texto-secundario">
                            <span>
                                <img src="../assets/images/Vector_Bookmark.png" alt="" width="12" height="12">
                                <strong class="count-likes">0</strong> me gusta
                            </span>
                            <span>· 0 comentarios</span>
                            <span>· 0 compartidos</span>
                        </div>
                        <div class="acciones-publicacion">
                            <button type="button" class="btn-like">
                                <img src="../assets/images/Vector_Bookmark.png" alt="" width="13" height="13">
                                Me gusta
                            </button>
                            <button type="button" class="btn-comentar">
                                <img src="../assets/images/Vector_Search.png" alt="" width="13" height="13">
                                Comentar
                            </button>
                            <a href="Network.html" class="boton-conectar">
                                <img src="../assets/images/Vector_Plus.png" alt="" width="12" height="12">
                                Conectar
                            </a>
                        </div>
                    </footer>
                </article>
            `;

            const cabeceraSeccion = contenedorFeed.querySelector('.cabecera-seccion');
            if (cabeceraSeccion) {
                cabeceraSeccion.insertAdjacentHTML('afterend', nuevoPostHTML);
            } else {
                contenedorFeed.insertAdjacentHTML('afterbegin', nuevoPostHTML);
            }

            asignarEventosInteraccion();
            textareaPost.value = '';
        });
    }

    cargarPublicaciones();
});