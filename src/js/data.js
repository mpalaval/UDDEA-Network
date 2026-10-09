// src/js/data.js
const API_BASE = '/api';

export const UDDEAData = {
    async getEstado() {
        try {
            const res = await fetch(`${API_BASE}/estado`);
            return await res.json();
        } catch (e) {
            console.error('Error obteniendo estado:', e);
            return null;
        }
    },

    async getEquipos(leagueId = 1) {
        try {
            const res = await fetch(`${API_BASE}/equipos?league=${leagueId}`);
            return await res.json();
        } catch (e) {
            console.error('Error obteniendo equipos:', e);
            return { datos: [] };
        }
    },

    async getProfesionales() {
        try {
            const res = await fetch(`${API_BASE}/profesionales`);
            return await res.json();
        } catch (e) {
            console.error('Error obteniendo profesionales:', e);
            return [];
        }
    },

    async getPublicaciones() {
        try {
            const res = await fetch(`${API_BASE}/publicaciones`);
            return await res.json();
        } catch (e) {
            console.error('Error obteniendo publicaciones:', e);
            return [];
        }
    }
};