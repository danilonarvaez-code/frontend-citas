
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Citas = () => {
  // 1. Estado inicial ajustado para coincidir con tu Backend en Java
  const [formData, setFormData] = useState({ 
    fechaHora: '', 
    especialidad: '', 
    usuarioId: '' 
  });

  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Para cargar la lista en el select
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // URL correcta apuntando al Backend con '/api'
  const API_URL = 'http://localhost:8080/api/citas';
  const API_USUARIOS_URL = 'http://localhost:8080/api/usuarios';

  // Cargar citas y usuarios al montar el componente
  useEffect(() => {
    obtenerCitas();
    obtenerUsuarios();
  }, []);

  const obtenerCitas = async () => {
    try {
      const response = await axios.get(API_URL);
      setCitas(response.data);
    } catch (err) {
      console.error("Error al obtener citas:", err);
      setError("No se pudieron cargar las citas.");
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(API_USUARIOS_URL);
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios para las citas:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Ajusta el mapeo en handleEditar leyendo correctamente la estructura de la base de datos
  const handleEditar = (cita) => {
    setEditId(cita.id);
    setFormData({
      fechaHora: cita.fechaHora || '',
      especialidad: cita.especialidad || '',
      usuarioId: cita.usuario ? cita.usuario.id : '' // Extrae el ID del objeto usuario de Java
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas cancelar esta cita?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        obtenerCitas();
      } catch (err) {
        console.error("Error al eliminar cita:", err);
        setError("Error al intentar eliminar la cita.");
      }
    }
  };

  // 2. Ajusta el envío de datos en handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fechaHora || !formData.especialidad || !formData.usuarioId) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    // Estructuramos el JSON exactamente como lo espera Spring Boot
    const datosAEnviar = {
      fechaHora: formData.fechaHora, // Coincide con LocalDateTime en Java
      especialidad: formData.especialidad, // Coincide con el String en Java
      usuario: { id: parseInt(formData.usuarioId) } // Pasa la relación como objeto
    };

    try {
      if (editId) {
        // Petición PUT para actualizar la cita existente
        await axios.put(`${API_URL}/${editId}`, datosAEnviar);
        setEditId(null);
      } else {
        // Petición POST para guardar una nueva cita
        await axios.post(API_URL, datosAEnviar);
      }

      // CORREGIDO: Limpiar formulario usando 'especialidad' en español
      setFormData({ fechaHora: '', especialidad: '', usuarioId: '' });
      obtenerCitas();
    } catch (err) {
      console.error("Error al guardar la cita:", err);
      setError("Ocurrió un error en el servidor al procesar la cita.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Agendamiento de Citas - Saludría</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Formulario de Registro */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        
        <label>Fecha y Hora:</label>
        <input 
          type="datetime-local" 
          name="fechaHora" 
          value={formData.fechaHora} 
          onChange={handleChange} 
          required 
        />

        <label>Especialidad Médica:</label>
        <input 
          type="text" 
          name="especialidad" 
          placeholder="Ej: Odontología, Medicina General" 
          value={formData.especialidad} // CORREGIDO: Sin duplicación de formData
          onChange={handleChange} 
          required 
        />

        <label>Seleccionar Paciente (Usuario):</label>
        <select 
          name="usuarioId" 
          value={formData.usuarioId} 
          onChange={handleChange} 
          required
        >
          <option value="">-- Elija un Paciente --</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} {u.apellido} (Doc: {u.documentoIdentidad})
            </option>
          ))}
        </select>

        <button type="submit" style={{ backgroundColor: '#008CBA', color: 'white', padding: '10px', cursor: 'pointer' }}>
          {editId ? 'Modificar Cita' : 'Agendar Cita'}
        </button>
        {editId && (
          <button 
            type="button" 
            onClick={() => { setEditId(null); setFormData({ fechaHora: '', especialidad: '', usuarioId: '' }); }}
            style={{ backgroundColor: '#f44336', color: 'white', padding: '10px', cursor: 'pointer' }}
          >
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Listado de Citas */}
      <h3>Citas Programadas</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Fecha y Hora</th>
            <th>Especialidad</th>
            <th>Paciente / Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No hay citas agendadas.</td>
            </tr>
          ) : (
            citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.fechaHora ? new Date(cita.fechaHora).toLocaleString() : ''}</td>
                <td>{cita.especialidad}</td>
                <td>
                  {cita.usuario 
                    ? `${cita.usuario.nombre} ${cita.usuario.apellido || ''} (Doc: ${cita.usuario.documentoIdentidad})`
                    : 'Paciente no asignado'}
                </td>
                <td>
                  <button onClick={() => handleEditar(cita)} style={{ marginRight: '5px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleEliminar(cita.id)} style={{ backgroundColor: '#ff9800', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Citas;