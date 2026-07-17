import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = () => {
  // 1. Estado inicial con los nombres exactos de tu Backend en Java
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documentoIdentidad: '', // Coincide con tu entidad de Java
    telefono: '',
    correo: '' // Se cambió 'email' por 'correo' para que coincida con Java
  });

  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // URL correcta apuntando al Backend con '/api'
  const API_URL = 'http://localhost:8080/api/usuarios';

  // Cargar usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Mapear correctamente los campos que vienen de la Base de Datos al editar
  const handleEditar = (usuario) => {
    setEditId(usuario.id);
    setFormData({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      documentoIdentidad: usuario.documentoIdentidad || '',
      telefono: usuario.telefono || '',
      correo: usuario.correo || ''
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        obtenerUsuarios();
      } catch (err) {
        console.error("Error al eliminar:", err);
        setError("Error al intentar eliminar el usuario.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica antes de enviar
    if (!formData.nombre || !formData.documentoIdentidad || !formData.correo) {
      setError("Por favor, rellena los campos obligatorios (Nombre, Documento y Correo).");
      return;
    }

    try {
      if (editId) {
        // Petición PUT para actualizar
        await axios.put(`${API_URL}/${editId}`, formData);
        setEditId(null);
      } else {
        // Petición POST para guardar nuevo usuario
        await axios.post(API_URL, formData);
      }
      
      // Limpiar formulario y refrescar lista
      setFormData({ nombre: '', apellido: '', documentoIdentidad: '', telefono: '', correo: '' });
      obtenerUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("Ocurrió un error al procesar la solicitud en el servidor.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestión de Usuarios - Saludría</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre" 
          value={formData.nombre} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="apellido" 
          placeholder="Apellido" 
          value={formData.apellido} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="documentoIdentidad" 
          placeholder="Documento de Identidad" 
          value={formData.documentoIdentidad} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="telefono" 
          placeholder="Teléfono" 
          value={formData.telefono} 
          onChange={handleChange} 
        />
        <input 
          type="email" 
          name="correo" 
          placeholder="Correo Electrónico" 
          value={formData.correo} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', cursor: 'pointer' }}>
          {editId ? 'Actualizar Usuario' : 'Registrar Usuario'}
        </button>
        {editId && (
          <button 
            type="button" 
            onClick={() => { setEditId(null); setFormData({ nombre: '', apellido: '', documentoIdentidad: '', telefono: '', correo: '' }); }}
            style={{ backgroundColor: '#f44336', color: 'white', padding: '10px', cursor: 'pointer' }}
          >
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Tabla de Registros */}
      <h3>Listado de Usuarios</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Documento</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.documentoIdentidad}</td>
                <td>{`${usuario.nombre} ${usuario.apellido || ''}`}</td>
                <td>{usuario.telefono || 'N/A'}</td>
                <td>{usuario.correo}</td>
                <td>
                  <button onClick={() => handleEditar(usuario)} style={{ marginRight: '5px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleEliminar(usuario.id)} style={{ backgroundColor: '#ff9800', color: 'white', cursor: 'pointer' }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;