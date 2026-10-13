document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CARRUSEL DE LA SECCIÓN "VALIDACIÓN Y CONFIANZA"
    // =========================================================

    const carrusel = document.querySelector("#carrusel-confianza");

    // Si el carrusel no existe en esta página, no ejecutamos nada
    if (!carrusel) {
        return;
    }

    const diapositivas = carrusel.querySelectorAll(".carrusel-diapositiva");
    const puntos = carrusel.querySelectorAll(".punto");

    let diapositivaActual = 0;
    let intervaloCarrusel = null;

    const TIEMPO_CAMBIO = 5000;


    // =========================================================
    // MOSTRAR UNA DIAPOSITIVA
    // =========================================================

    function mostrarDiapositiva(indice) {

        // Quitamos la clase activa de todas las diapositivas
        diapositivas.forEach((diapositiva) => {
            diapositiva.classList.remove("activa");
        });

        // Quitamos la clase activa de todos los puntos
        puntos.forEach((punto) => {
            punto.classList.remove("activo");
        });

        // Activamos la diapositiva correspondiente
        diapositivas[indice].classList.add("activa");

        // Activamos también su punto
        puntos[indice].classList.add("activo");

        // Guardamos cuál es la diapositiva actual
        diapositivaActual = indice;
    }


    // =========================================================
    // PASAR A LA SIGUIENTE DIAPOSITIVA
    // =========================================================

    function siguienteDiapositiva() {

        const siguienteIndice =
            (diapositivaActual + 1) % diapositivas.length;

        mostrarDiapositiva(siguienteIndice);
    }


    // =========================================================
    // INICIAR ROTACIÓN AUTOMÁTICA
    // =========================================================

    function iniciarCarrusel() {

        // Evita crear varios intervalos a la vez
        detenerCarrusel();

        intervaloCarrusel = setInterval(
            siguienteDiapositiva,
            TIEMPO_CAMBIO
        );
    }


    // =========================================================
    // DETENER ROTACIÓN AUTOMÁTICA
    // =========================================================

    function detenerCarrusel() {

        if (intervaloCarrusel !== null) {

            clearInterval(intervaloCarrusel);

            intervaloCarrusel = null;
        }
    }


    // =========================================================
    // NAVEGACIÓN MEDIANTE LOS PUNTOS
    // =========================================================

    puntos.forEach((punto, indice) => {

        punto.addEventListener("click", () => {

            mostrarDiapositiva(indice);

            // Reiniciamos el temporizador para que
            // no cambie inmediatamente después del clic
            iniciarCarrusel();
        });

    });


    // =========================================================
    // PAUSAR AL PASAR EL RATÓN SOBRE EL CARRUSEL
    // =========================================================

    carrusel.addEventListener("mouseenter", () => {
        detenerCarrusel();
    });


    carrusel.addEventListener("mouseleave", () => {
        iniciarCarrusel();
    });


    // =========================================================
    // PAUSAR SI EL USUARIO CAMBIA DE PESTAÑA
    // =========================================================

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            detenerCarrusel();
        } else {
            iniciarCarrusel();
        }

    });


    // =========================================================
    // INICIO DEL CARRUSEL
    // =========================================================

    mostrarDiapositiva(0);

    iniciarCarrusel();

});