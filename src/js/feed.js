document.addEventListener('DOMContentLoaded', () => {
    const contenedorFeed = document.getElementById('contenedor-feed');
    const formularioPost = document.getElementById('formulario-publicar');

    // 1. Cargar publicaciones dinámicas
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
        contenedorFeed.innerHTML = '';

        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'tarjeta publicacion';
            article.dataset.id = post.id;

            const mediaHTML = post.media ? `
                <div class="media-publicacion">
                    <img src="${post.media.url}" alt="${post.media.alt || ''}">
                </div>
            ` : '';

            article.innerHTML = `
                <header class="cabecera-publicacion">
                    <a href="Profile.html" class="enlace-perfil-autor">
                        <img src="${post.autorAvatar}" alt="" class="avatar-autor" width="40" height="40">
                    </a>
                    <div class="info-autor">
                        <h3><a href="Profile.html" class="enlace-autor">${post.autorNombre}</a></h3>
                        <p class="cargo-autor">${post.autorCargo}</p>
                        <span class="tiempo-publicacion texto-secundario">${post.tiempo}</span>
                    </div>
                </header>

                <div class="contenido-publicacion">
                    <p>${post.contenido}</p>
                    ${mediaHTML}
                </div>

                <footer class="pie-publicacion">
                    <div class="interacciones-stats texto-secundario">
                        <span>❤️ <span class="count-likes">${post.likes}</span></span>
                        <span>💬 ${post.comentarios} comentarios</span>
                        <span>🔁 ${post.compartidos} compartidos</span>
                    </div>
                    <div class="acciones-publicacion">
                        <button type="button" class="boton-accion-post btn-like">
                            👍 Me gusta
                        </button>
                        <button type="button" class="boton-accion-post btn-comentar">
                            💬 Comentar
                        </button>
                        <a href="Network.html" class="boton-accion-post">
                            🔗 Conectar
                        </a>
                    </div>
                </footer>
            `;

            // Evento para el botón de "Me gusta" (interacción visual local)
            const btnLike = article.querySelector('.btn-like');
            const countLikes = article.querySelector('.count-likes');
            let liked = false;

            btnLike.addEventListener('click', () => {
                liked = !liked;
                let actual = parseInt(countLikes.textContent, 10);
                countLikes.textContent = liked ? actual + 1 : actual - 1;
                btnLike.classList.toggle('activo', liked);
            });

            contenedorFeed.appendChild(article);
        });
    }

    // 2. Crear nueva publicación en tiempo real
    if (formularioPost) {
        formularioPost.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = formularioPost.querySelector('textarea');
            const texto = textarea ? textarea.value.trim() : '';

            if (!texto) return;

            const nuevoPost = {
                id: `pub-${Date.now()}`,
                autorNombre: "Alejandro Martín",
                autorCargo: "Analista Táctico · Candidato",
                autorAvatar: "../assets/images/Avatar_Genérico_6.png",
                tiempo: "Justo ahora",
                contenido: texto,
                media: null,
                likes: 0,
                comentarios: 0,
                compartidos: 0
            };

            // Insertar al principio del feed
            const articuloNuevo = document.createElement('article');
            articuloNuevo.className = 'tarjeta publicacion';
            articuloNuevo.innerHTML = `
                <header class="cabecera-publicacion">
                    <a href="Profile.html"><img src="${nuevoPost.autorAvatar}" alt="" class="avatar-autor" width="40" height="40"></a>
                    <div class="info-autor">
                        <h3><a href="Profile.html" class="enlace-autor">${nuevoPost.autorNombre}</a></h3>
                        <p class="cargo-autor">${nuevoPost.autorCargo}</p>
                        <span class="tiempo-publicacion texto-secundario">${nuevoPost.tiempo}</span>
                    </div>
                </header>
                <div class="contenido-publicacion"><p>${nuevoPost.contenido}</p></div>
                <footer class="pie-publicacion">
                    <div class="interacciones-stats texto-secundario">
                        <span>❤️ 0</span><span>💬 0 comentarios</span>
                    </div>
                </footer>
            `;

            contenedorFeed.insertBefore(articuloNuevo, contenedorFeed.firstChild);
            textarea.value = '';
        });
    }

    cargarPublicaciones();
});