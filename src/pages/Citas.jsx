import React, { useState, useEffect } from 'react';
import { citaService } from '../services/citaService';

export const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [formData, setFormData] = useState({ fecha: '', descripcion: '', usuarioId: '' });
  const [errores, setErrores] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    listarCitas();
    cargarUsuarios();
  }, []);

  const listarCitas = async () => {
    try {
      const response = await citaService.getAll();
      setCitas(response.data || []);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar usuarios para el selector:", error);
    }
  };

  const validarFormulario = () => {
    let camposErrores = {};
    if (!formData.usuarioId) camposErrores.usuarioId = "Debe seleccionar un usuario.";
    if (!formData.descripcion.trim()) camposErrores.descripcion = "La descripción es obligatoria.";
    if (!formData.fecha) camposErrores.fecha = "La fecha es obligatoria.";
    
    setErrores(camposErrores);
    return Object.keys(camposErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const datosAEnviar = {
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      usuario: {
        id: parseInt(formData.usuarioId)
      }
    };

    try {
      if (editId) {
        await citaService.update(editId, datosAEnviar);
        alert("¡Cita reprogramada con éxito!");
      } else {
        await citaService.create(datosAEnviar);
        alert("¡Cita agendada con éxito!");
      }
      resetearFormulario();
      listarCitas();
    } catch (error) {
      console.error("Error al procesar la cita:", error);
      alert("Hubo un problema al guardar la cita.");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de cancelar esta cita?")) {
      try {
        await citaService.delete(id);
        listarCitas();
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
      }
    }
  };

  const handleEditar = (cita) => {
    setEditId(cita.id);
    setFormData({
      fecha: cita.fecha,
      descripcion: cita.descripcion,
      usuarioId: cita.usuario ? cita.usuario.id : ''
    });
  };

  const resetearFormulario = () => {
    setFormData({ fecha: '', descripcion: '', usuarioId: '' });
    setEditId(null);
    setErrores({});
  };

  return (
    <div style={{ 
      padding: '30px', 
      fontFamily: '"Segoe UI", Roboto, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      color: '#333'
    }}>
      <h2 style={{ 
        color: '#1a365d', 
        marginBottom: '25px', 
        borderBottom: '2px solid #e2e8f0', 
        paddingBottom: '10px',
        fontWeight: '600'
      }}>
        Módulo de Gestión de Citas Médicas
      </h2>
      
      {/* Contenedor del Formulario */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '25px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
        marginBottom: '40px', 
        maxWidth: '500px' 
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2b6cb0', fontSize: '18px' }}>
          {editId ? '🔄 Reprogramar Cita Médica' : '📅 Agendar Nueva Cita'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Seleccionar Paciente (Usuario):
            </label>
            <select 
              value={formData.usuarioId} 
              onChange={e => setFormData({...formData, usuarioId: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', backgroundColor: '#fff' }}
            >
              <option value="">-- Seleccione un usuario --</option>
              {usuarios.length > 0 && usuarios.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nombre} ({user.email || 'Sin correo'})
                </option>
              ))}
            </select>
            {errores.usuarioId && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.usuarioId}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Descripción / Especialidad:
            </label>
            <input 
              type="text" 
              placeholder="Ej: Odontología, Pediatría..." 
              value={formData.descripcion} 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
            {errores.descripcion && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.descripcion}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Fecha de la Cita:
            </label>
            <input 
              type="date" 
              value={formData.fecha} 
              onChange={e => setFormData({...formData, fecha: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
            {errores.fecha && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.fecha}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ 
              padding: '10px 20px', 
              backgroundColor: editId ? '#dd6b20' : '#3182ce', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1
            }}>
              {editId ? 'Actualizar Cita' : 'Confirmar Cita'}
            </button>
            {editId && (
              <button type="button" onClick={resetearFormulario} style={{ 
                padding: '10px 20px', 
                backgroundColor: '#e2e8f0', 
                color: '#4a5568', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado de Citas Card-Table */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1a365d', fontSize: '18px' }}>
          📋 Historial y Control de Citas Activas
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', borderBottom: '2px solid #bee3f8' }}>
              <th style={{ padding: '12px 15px' }}>ID</th>
              <th style={{ padding: '12px 15px' }}>Paciente / Usuario</th>
              <th style={{ padding: '12px 15px' }}>Correo Electrónico</th>
              <th style={{ padding: '12px 15px' }}>Especialidad / Detalles</th>
              <th style={{ padding: '12px 15px' }}>Fecha Asignada</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#718096', fontStyle: 'italic' }}>
                  No hay citas médicas registradas en el sistema actualmente.
                </td>
              </tr>
            ) : (
              citas.map(cita => (
                <tr key={cita.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#4a5568' }}>{cita.id}</td>
                  <td style={{ padding: '12px 15px', color: '#2d3748', fontWeight: '500' }}>
                    {cita.usuario ? cita.usuario.nombre : '⚠️ No asignado'}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#718096' }}>
                    {cita.usuario ? cita.usuario.email : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#2d3748' }}>
                    <span style={{ backgroundColor: '#edf2f7', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                      {cita.descripcion}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px', color: '#2d3748', fontWeight: '500' }}>{cita.fecha}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEditar(cita)} 
                      style={{ 
                        marginRight: '8px', 
                        padding: '6px 12px', 
                        backgroundColor: '#feebc8', 
                        color: '#c05621', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(cita.id)} 
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#fed7d7', 
                        color: '#9b2c2c', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Cancelar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};