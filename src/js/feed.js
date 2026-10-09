// src/js/feed.js
import { UDDEAData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.querySelector('.center-column');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Cargar publicaciones desde la API del servidor
    const postsData = await UDDEAData.getPublicaciones();

    // Renderizado dinámico de posts
    function renderPosts(filter = 'all') {
        const existingPosts = document.querySelectorAll('.post');
        existingPosts.forEach(p => p.remove());

        const filtered = filter === 'connections' 
            ? postsData.filter(p => p.esConexion) 
            : postsData;

        filtered.forEach(post => {
            const article = document.createElement('article');
            article.className = 'feed-card post';
            article.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar">${post.iniciales || 'U'}</div>
                    <div class="post-author">
                        <h5>${post.autor}</h5>
                        <span>${post.cargo} · ${post.federacion}</span>
                    </div>
                    ${post.validado ? '<span class="post-badge">Validado</span>' : ''}
                </div>
                <div class="post-content">
                    <p>${post.contenido}</p>
                </div>
                <div class="post-actions">
                    <button class="btn-action">Conectar</button>
                    <button class="btn-action">Me gusta (${post.likes || 0})</button>
                    <button class="btn-action">Comentar</button>
                </div>
            `;
            postContainer.appendChild(article);
        });
    }

    // Inicializar listeners de filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const mode = e.target.textContent.includes('Conexiones') ? 'connections' : 'all';
            renderPosts(mode);
        });
    });

    if (postsData.length > 0) {
        renderPosts('all');
    }
});