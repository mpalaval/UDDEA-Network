// src/js/home.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const federation = document.getElementById('federation').value;

            if (!federation) {
                alert('Debes seleccionar tu Federación Regional para vincular la cuenta.');
                return;
            }

            // Guardar datos de sesión localmente para el prototipo
            localStorage.setItem('uddea_user', JSON.stringify({
                name: username.split('@')[0] || 'Usuario UDDEA',
                email: username,
                federation: federation,
                elo: 1450,
                status: 'empleo'
            }));

            // Redirigir al Feed principal
            window.location.href = 'Feedv2.html';
        });
    }
});