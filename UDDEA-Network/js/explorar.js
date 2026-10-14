document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS
       ========================================================= */

    const launcher =
        document.getElementById("assistant-launcher");


    if (!launcher) {
        return;
    }


    /* =========================================================
       CREAR ASISTENTE
       ========================================================= */

    const assistant = document.createElement("aside");

    assistant.className = "certification-assistant";
    assistant.id = "certification-assistant";

    assistant.setAttribute("aria-hidden", "true");


    assistant.innerHTML = `

        <header class="assistant-header">

            <div>

                <span>
                    Tu camino formativo
                </span>

                <h2>
                    Asistente de certificaciones
                </h2>

                <small>
                    Simulación visual
                </small>

            </div>


            <button
                type="button"
                id="close-assistant"
                aria-label="Cerrar asistente"
            >
                ×
            </button>

        </header>


        <div class="assistant-content">


            <div class="assistant-message assistant-message-bot">

                <strong>
                    ¡Hola, Álvaro!
                </strong>

                <p>
                    Te ayudo a ordenar tu próximo paso formativo.
                </p>

            </div>


            <div class="assistant-suggestions">

                <button
                    type="button"
                    data-question="¿Qué quiero mejorar como analista?"
                >
                    ¿Qué quiero mejorar como analista?
                </button>


                <button
                    type="button"
                    data-question="¿Cómo comparar certificaciones?"
                >
                    ¿Cómo comparar certificaciones?
                </button>


                <button
                    type="button"
                    data-question="¿Qué documento conviene aportar?"
                >
                    ¿Qué documento conviene aportar?
                </button>

            </div>


            <div
                class="assistant-conversation"
                id="assistant-conversation"
            >

                <div class="assistant-message assistant-message-user">

                    <p>
                        Soy analista de fútbol y quiero mejorar
                        cómo comunico mis informes al cuerpo técnico.
                        Dispongo de 4 horas a la semana.
                    </p>

                </div>


                <div class="assistant-message assistant-message-bot">

                    <p>
                        Partiría de tu experiencia en CD Ribera
                        y de tu formación en vídeo.
                        Te propongo este recorrido:
                    </p>

                    <ol>

                        <li>
                            <strong>
                                Comunicación con el staff
                            </strong>
                            · Clínic de 8 h.
                        </li>

                        <li>
                            <strong>
                                Análisis táctico aplicado
                            </strong>
                            · Curso de 24 h.
                        </li>

                        <li>
                            Prepara un informe breve y pide
                            feedback al entrenador.
                        </li>

                    </ol>

                    <p>
                        Después, añade tu credencial al perfil
                        para solicitar revisión.
                    </p>

                </div>

            </div>


            <p class="assistant-disclaimer">
                Orientación ilustrativa, no un asistente activo
                ni un aval de certificación.
                Programas y emisores de ejemplo.
            </p>

        </div>


        <form
            class="assistant-input-area"
            id="assistant-form"
        >

            <label for="assistant-input">
                Tu mensaje
            </label>


            <div>

                <input
                    type="text"
                    id="assistant-input"
                    placeholder="¿Qué debería incluir mi portfolio?"
                    autocomplete="off"
                >

                <button type="submit">
                    Enviar
                </button>

            </div>

        </form>

    `;


    document.body.appendChild(assistant);


    /* =========================================================
       ELEMENTOS INTERNOS
       ========================================================= */

    const closeButton =
        document.getElementById("close-assistant");

    const form =
        document.getElementById("assistant-form");

    const input =
        document.getElementById("assistant-input");

    const conversation =
        document.getElementById("assistant-conversation");

    const suggestions =
        assistant.querySelectorAll("[data-question]");


    /* =========================================================
       ABRIR
       ========================================================= */

    function abrirAsistente() {

        assistant.classList.add("open");

        assistant.setAttribute(
            "aria-hidden",
            "false"
        );

        launcher.classList.add("active");

    }


    /* =========================================================
       CERRAR
       ========================================================= */

    function cerrarAsistente() {

        assistant.classList.remove("open");

        assistant.setAttribute(
            "aria-hidden",
            "true"
        );

        launcher.classList.remove("active");

    }


    /* =========================================================
       AÑADIR MENSAJE
       ========================================================= */

    function agregarMensaje(texto, tipo) {

        const mensaje =
            document.createElement("div");

        mensaje.className =
            `assistant-message assistant-message-${tipo}`;


        const parrafo =
            document.createElement("p");

        parrafo.textContent = texto;


        mensaje.appendChild(parrafo);

        conversation.appendChild(mensaje);


        conversation.scrollTop =
            conversation.scrollHeight;

    }


    /* =========================================================
       RESPUESTA SIMULADA
       ========================================================= */

    function responder(mensajeUsuario) {

        const texto =
            mensajeUsuario.toLowerCase();

        let respuesta;


        if (
            texto.includes("certificacion") ||
            texto.includes("certificación")
        ) {

            respuesta =
                "Compara primero el contenido, la duración, " +
                "la modalidad y la entidad emisora. Después " +
                "valora qué aprendizaje encaja mejor con tu " +
                "objetivo profesional.";

        }

        else if (
            texto.includes("documento") ||
            texto.includes("credencial")
        ) {

            respuesta =
                "Aporta un documento donde puedan identificarse " +
                "claramente la entidad emisora, tu nombre, " +
                "la formación realizada y la fecha de expedición.";

        }

        else if (
            texto.includes("portfolio") ||
            texto.includes("portafolio")
        ) {

            respuesta =
                "Para un perfil de analista incluiría ejemplos " +
                "breves de informes, análisis de rival, clips " +
                "seleccionados y una explicación clara de cómo " +
                "trasladas el análisis al cuerpo técnico.";

        }

        else if (
            texto.includes("analista") ||
            texto.includes("mejorar")
        ) {

            respuesta =
                "Podrías priorizar comunicación con el staff, " +
                "análisis táctico aplicado y presentación de " +
                "informes. Son áreas coherentes con el perfil " +
                "profesional mostrado en esta demo.";

        }

        else {

            respuesta =
                "En esta versión del prototipo puedo orientarte " +
                "sobre formación, certificaciones, documentación " +
                "y desarrollo profesional dentro del fútbol.";

        }


        setTimeout(() => {

            agregarMensaje(
                respuesta,
                "bot"
            );

        }, 350);

    }


    /* =========================================================
       ENVIAR MENSAJE
       ========================================================= */

    form.addEventListener("submit", (evento) => {

        evento.preventDefault();


        const texto =
            input.value.trim();


        if (!texto) {
            return;
        }


        agregarMensaje(
            texto,
            "user"
        );


        input.value = "";


        responder(texto);

    });


    /* =========================================================
       PREGUNTAS RÁPIDAS
       ========================================================= */

    suggestions.forEach((boton) => {

        boton.addEventListener("click", () => {

            const pregunta =
                boton.dataset.question;


            agregarMensaje(
                pregunta,
                "user"
            );


            responder(pregunta);

        });

    });


    /* =========================================================
       EVENTOS PRINCIPALES
       ========================================================= */

    launcher.addEventListener("click", () => {

        const abierto =
            assistant.classList.contains("open");


        if (abierto) {
            cerrarAsistente();
        }
        else {
            abrirAsistente();
        }

    });


    closeButton.addEventListener(
        "click",
        cerrarAsistente
    );


    /* ESC */

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            cerrarAsistente();
        }

    });

});