import axios from 'axios';

// URL de tu controlador de Citas en Spring Boot
const API_URL = 'http://localhost:8080/api/citas'; //  Corregido

export const citaService = {
  // GET - Listar todas las citas
  getAll: () => axios.get(API_URL),
  
  // POST - Agendar una nueva cita
  create: (data) => axios.post(API_URL, data),
  
  // PUT - Modificar una cita por ID
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  
  // DELETE - Cancelar/Eliminar una cita por ID
  delete: (id) => axios.delete(`${API_URL}/${id}`)
};