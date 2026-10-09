// src/js/explore.js
import { UDDEAData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Consulta los equipos de BeSoccer desde el servidor para mostrar en resultados
    const teamsData = await UDDEAData.getEquipos(1);
    
    if (teamsData && teamsData.datos) {
        console.log('Equipos obtenidos para el módulo Explore:', teamsData.origen);
    }

    // Scroll horizontal suave arrastrando o con rueda de ratón en los contenedores
    const scrollContainers = document.querySelectorAll('.horizontal-scroll-container');
    scrollContainers.forEach(container => {
        container.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            container.scrollLeft += evt.deltaY;
        });
    });
});