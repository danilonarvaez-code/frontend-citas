import axios from 'axios';

// Cambiamos la URL a la ruta directa que sí te funcionó:
const API_URL = 'http://localhost:8080/api/usuarios'; //  Corregido

export const usuarioService = {
  // GET - Listar todos
  getAll: () => axios.get(API_URL),
  
  // POST - Crear uno nuevo
  create: (data) => axios.post(API_URL, data),
  
  // PUT - Modificar por ID
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  
  // DELETE - Eliminar por ID
  delete: (id) => axios.delete(`${API_URL}/${id}`)
};