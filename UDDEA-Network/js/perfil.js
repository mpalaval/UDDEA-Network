document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS PRINCIPALES
       ========================================================= */

    const btnEditarPerfil =
        document.getElementById("open-edit-profile");

    const btnValidaciones =
        document.getElementById("open-validations");

    const btnDocumentacion =
        document.getElementById("open-documentation");


    /* =========================================================
       CREAR MODAL
       ========================================================= */

    function abrirModal(contenido, claseExtra = "") {

        cerrarModal();

        const overlay = document.createElement("div");
        overlay.className = "profile-modal-overlay";
        overlay.id = "profile-modal-overlay";

        overlay.innerHTML = `
            <div class="profile-modal ${claseExtra}">

                ${contenido}

            </div>
        `;

        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";


        /* CERRAR CON BOTONES */

        overlay
            .querySelectorAll("[data-close-modal]")
            .forEach((boton) => {

                boton.addEventListener("click", cerrarModal);

            });


        /* CERRAR PULSANDO FUERA */

        overlay.addEventListener("click", (evento) => {

            if (evento.target === overlay) {
                cerrarModal();
            }

        });
    }


    /* =========================================================
       CERRAR MODAL
       ========================================================= */

    function cerrarModal() {

        const modal =
            document.getElementById("profile-modal-overlay");

        if (modal) {
            modal.remove();
        }

        document.body.style.overflow = "";
    }


    /* =========================================================
       EDITAR PERFIL
       ========================================================= */

    function abrirEditarPerfil() {

        abrirModal(`

            <header class="profile-modal-header">

                <div>
                    <h2>Editar perfil profesional</h2>

                    <p>
                        Mantén tu trayectoria al día y decide cómo
                        quieres presentarte a la comunidad.
                    </p>
                </div>

                <button
                    type="button"
                    class="profile-modal-close"
                    data-close-modal
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </header>


            <nav class="profile-modal-tabs">

                <button type="button" class="active">
                    Datos personales
                </button>

                <button type="button">
                    Experiencia
                </button>

                <button type="button">
                    Formación
                </button>

                <button type="button">
                    Privacidad
                </button>

            </nav>


            <form id="edit-profile-form">

                <div class="modal-form-grid">

                    <label>

                        <span>Nombre y apellidos *</span>

                        <input
                            type="text"
                            id="edit-name"
                            value="Álvaro Martín"
                        >

                    </label>


                    <label>

                        <span>Titular profesional *</span>

                        <input
                            type="text"
                            id="edit-title"
                            value="Analista de fútbol"
                        >

                    </label>

                </div>


                <label class="modal-full-field">

                    <span>Acerca de mí</span>

                    <textarea
                        id="edit-about"
                        rows="4"
                    >Entiendo el análisis como una herramienta para mejorar el juego y acompañar al futbolista. Mi trabajo conecta la observación, el vídeo y los datos con decisiones útiles para el cuerpo técnico. Me interesa crecer en un proyecto que cuide su metodología y el desarrollo de cantera.</textarea>

                </label>


                <div class="modal-form-grid">

                    <label>

                        <span>País *</span>

                        <select>
                            <option>España</option>
                        </select>

                    </label>


                    <label>

                        <span>Zona regional *</span>

                        <select>
                            <option>Comunidad de Madrid</option>
                        </select>

                    </label>


                    <label>

                        <span>Objetivo profesional</span>

                        <select>
                            <option>Empleo</option>
                            <option>Prácticas</option>
                            <option>Formación</option>
                        </select>

                    </label>


                    <label>

                        <span>Disponibilidad</span>

                        <select>
                            <option>
                                Jornada completa o proyecto
                            </option>
                        </select>

                    </label>

                </div>


                <section class="modal-profile-block">

                    <h3>Experiencia</h3>

                    <div class="modal-profile-row">

                        <div>
                            <strong>CD Ribera</strong>

                            <span>
                                Analista de rendimiento ·
                                Sep. 2024 – Actualidad
                            </span>
                        </div>

                        <button type="button">
                            Editar →
                        </button>

                    </div>


                    <div class="modal-profile-row">

                        <div>
                            <strong>
                                Academia Fútbol Norte
                            </strong>

                            <span>
                                Asistente de análisis ·
                                Sep. 2022 – Jun. 2024
                            </span>
                        </div>

                        <button type="button">
                            Editar →
                        </button>

                    </div>


                    <small>
                        Ambas experiencias pendientes de validación
                        · + Añadir experiencia
                    </small>

                </section>


                <section class="modal-profile-block">

                    <h3>Formación y certificados</h3>

                    <p>
                        Especialización en análisis del juego ·
                        2023–2024 · Pendiente
                    </p>

                    <p>
                        Grado en CAFYD · 2018–2022 ·
                        Pendiente de revisión documental
                    </p>

                    <p>
                        Análisis de vídeo aplicado al fútbol ·
                        Validado
                    </p>

                    <p>
                        Metodología y desarrollo del futbolista ·
                        Pendiente
                    </p>

                </section>


                <section class="modal-profile-block">

                    <h3>Privacidad</h3>

                    <label class="modal-checkbox">

                        <input
                            type="checkbox"
                            checked
                        >

                        <span>
                            Mostrar mi disponibilidad a la comunidad
                        </span>

                    </label>


                    <label class="modal-checkbox">

                        <input
                            type="checkbox"
                            checked
                        >

                        <span>
                            Mostrar mis datos de contacto solo
                            a mis conexiones
                        </span>

                    </label>

                </section>


                <footer class="profile-modal-actions">

                    <button
                        type="button"
                        class="modal-secondary-button"
                        data-close-modal
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="modal-primary-button"
                    >
                        Guardar cambios
                    </button>

                </footer>

            </form>

        `, "edit-profile-modal");


        /* SIMULACIÓN DE GUARDADO */

        const formulario =
            document.getElementById("edit-profile-form");

        formulario.addEventListener("submit", (evento) => {

            evento.preventDefault();

            const nuevoNombre =
                document.getElementById("edit-name").value;

            const nuevoTitulo =
                document.getElementById("edit-title").value;


            const nombrePerfil =
                document.querySelector(".profile-name h1");

            const tituloPerfil =
                document.querySelector(".profile-title");


            if (nombrePerfil) {
                nombrePerfil.textContent = nuevoNombre;
            }

            if (tituloPerfil) {
                tituloPerfil.textContent =
                    `${nuevoTitulo} · Rendimiento y metodología`;
            }

            cerrarModal();

        });

    }


    /* =========================================================
       GESTIONAR VALIDACIONES
       ========================================================= */

    function abrirValidaciones() {

        abrirModal(`

            <header class="profile-modal-header">

                <div>

                    <h2>
                        Gestionar validaciones
                    </h2>

                    <p>
                        Revisa qué información tiene respaldo
                        documental y qué necesitas completar.
                    </p>

                </div>


                <button
                    type="button"
                    class="profile-modal-close"
                    data-close-modal
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </header>


            <div class="validation-list">


                <article class="validation-row">

                    <div>

                        <h3>
                            Identidad y correo
                        </h3>

                        <p>
                            Álvaro Martín · Correo confirmado
                        </p>

                        <span class="validation-ok">
                            Validado · Ejemplo
                        </span>

                    </div>

                    <button type="button">
                        Revisar
                    </button>

                </article>


                <article class="validation-row">

                    <div>

                        <h3>
                            Experiencia profesional
                        </h3>

                        <p>
                            CD Ribera / Academia Fútbol Norte
                        </p>

                        <span class="validation-pending">
                            Pendiente
                        </span>

                    </div>

                    <button
                        type="button"
                        data-open-documentation
                    >
                        Aportar documento
                    </button>

                </article>


                <article class="validation-row">

                    <div>

                        <h3>
                            Formación
                        </h3>

                        <p>
                            Especialización en análisis del juego ·
                            Grado en CAFYD
                        </p>

                        <span class="validation-pending">
                            Pendiente
                        </span>

                    </div>

                    <button
                        type="button"
                        data-open-documentation
                    >
                        Aportar documento
                    </button>

                </article>


                <article class="validation-row">

                    <div>

                        <h3>
                            Análisis de vídeo aplicado al fútbol
                        </h3>

                        <p>
                            Aula Fútbol · Junio 2025 ·
                            Entidad de ejemplo
                        </p>

                        <span class="validation-ok">
                            Validado · Ejemplo
                        </span>

                    </div>

                    <button type="button">
                        Revisar
                    </button>

                </article>


                <article class="validation-row">

                    <div>

                        <h3>
                            Metodología y desarrollo del futbolista
                        </h3>

                        <p>
                            Campus Entrena · 2026 ·
                            Entidad de ejemplo
                        </p>

                        <span class="validation-pending">
                            Pendiente
                        </span>

                    </div>

                    <button
                        type="button"
                        data-open-documentation
                    >
                        Solicitar revisión
                    </button>

                </article>

            </div>


            <section class="validation-info">

                <h3>
                    Cómo se revisaría tu documentación
                </h3>

                <p>
                    Se contrastarían emisor, fechas y relación
                    con la credencial declarada. Si falta
                    información, se pediría una ampliación antes
                    de cambiar el estado.
                </p>

                <small>
                    Estados ilustrativos del prototipo.
                    No representan verificaciones reales.
                </small>

            </section>


            <footer class="profile-modal-actions">

                <button
                    type="button"
                    class="modal-secondary-button"
                    data-close-modal
                >
                    Volver a mi perfil
                </button>

            </footer>

        `, "validation-modal");


        document
            .querySelectorAll("[data-open-documentation]")
            .forEach((boton) => {

                boton.addEventListener(
                    "click",
                    abrirDocumentacion
                );

            });

    }


    /* =========================================================
       AÑADIR DOCUMENTACIÓN
       ========================================================= */

    function abrirDocumentacion() {

        abrirModal(`

            <header class="profile-modal-header">

                <div>

                    <h2>
                        Añadir documentación
                    </h2>

                    <p>
                        Aporta respaldo a tu trayectoria.
                        Revisa el contenido y la visibilidad
                        antes de enviarlo.
                    </p>

                </div>


                <button
                    type="button"
                    class="profile-modal-close"
                    data-close-modal
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </header>


            <form id="documentation-form">


                <label class="modal-full-field">

                    <span>
                        Tipo de documento *
                    </span>

                    <select>
                        <option>
                            Certificado de formación
                        </option>

                        <option>
                            Título académico
                        </option>

                        <option>
                            Documento de experiencia
                        </option>
                    </select>

                </label>


                <label class="modal-full-field">

                    <span>
                        Credencial relacionada *
                    </span>

                    <select>
                        <option>
                            Metodología y desarrollo del futbolista
                        </option>

                        <option>
                            Especialización en análisis del juego
                        </option>
                    </select>

                </label>


                <div class="modal-form-grid">

                    <label>

                        <span>
                            Institución / emisor *
                        </span>

                        <input
                            type="text"
                            value="Campus Entrena"
                        >

                    </label>


                    <label>

                        <span>
                            Fecha de expedición *
                        </span>

                        <input
                            type="date"
                            value="2026-09-15"
                        >

                    </label>

                </div>


                <label
                    class="document-dropzone"
                    for="document-file"
                >

                    <strong>
                        Arrastra tu documento o selecciona
                        un archivo
                    </strong>

                    <span>
                        PDF, JPG o PNG · Máximo 10 MB
                    </span>

                    <input
                        type="file"
                        id="document-file"
                        accept=".pdf,.jpg,.jpeg,.png"
                    >

                </label>


                <div
                    class="document-preview"
                    id="document-preview"
                    hidden
                >

                    <strong id="document-name">
                        documento.pdf
                    </strong>

                    <span id="document-size"></span>

                </div>


                <section class="modal-profile-block">

                    <h3>
                        Privacidad del documento
                    </h3>


                    <label class="modal-checkbox">

                        <input
                            type="checkbox"
                            checked
                        >

                        <span>
                            Solo visible para el equipo de revisión.
                            No publicar el archivo en mi perfil.
                        </span>

                    </label>


                    <label class="modal-checkbox">

                        <input
                            type="checkbox"
                            checked
                        >

                        <span>
                            Declaro que puedo compartir este documento
                            y que sus datos corresponden a mi trayectoria.
                        </span>

                    </label>

                </section>


                <p class="modal-notice">
                    Enviar iniciaría una revisión; no valida
                    automáticamente la credencial.
                    Esta versión es una simulación del prototipo.
                </p>


                <footer class="profile-modal-actions">

                    <button
                        type="button"
                        class="modal-secondary-button"
                        data-close-modal
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="modal-primary-button"
                    >
                        Enviar para revisión
                    </button>

                </footer>

            </form>

        `, "documentation-modal");


        /* PREVISUALIZACIÓN DEL ARCHIVO */

        const inputArchivo =
            document.getElementById("document-file");

        const preview =
            document.getElementById("document-preview");

        const nombre =
            document.getElementById("document-name");

        const tamano =
            document.getElementById("document-size");


        inputArchivo.addEventListener("change", () => {

            const archivo = inputArchivo.files[0];

            if (!archivo) {
                preview.hidden = true;
                return;
            }

            nombre.textContent = archivo.name;

            tamano.textContent =
                `${(archivo.size / 1024 / 1024).toFixed(2)} MB`;

            preview.hidden = false;

        });


        /* ENVÍO SIMULADO */

        const formulario =
            document.getElementById("documentation-form");

        formulario.addEventListener("submit", (evento) => {

            evento.preventDefault();

            cerrarModal();

        });

    }


    /* =========================================================
       EVENTOS
       ========================================================= */

    if (btnEditarPerfil) {

        btnEditarPerfil.addEventListener(
            "click",
            abrirEditarPerfil
        );

    }


    if (btnValidaciones) {

        btnValidaciones.addEventListener(
            "click",
            abrirValidaciones
        );

    }


    if (btnDocumentacion) {

        btnDocumentacion.addEventListener(
            "click",
            abrirDocumentacion
        );

    }


    /* ESC */

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            cerrarModal();
        }

    });

});