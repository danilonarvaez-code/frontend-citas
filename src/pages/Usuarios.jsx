import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [errores, setErrores] = useState({});
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:8080/usuarios';

  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsuarios(response.data || []);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    }
  };

  const validarFormulario = () => {
    let camposErrores = {};
    if (!formData.nombre.trim()) camposErrores.nombre = "El nombre completo es obligatorio.";
    if (!formData.email.trim()) {
      camposErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      camposErrores.email = "El formato del correo no es válido.";
    }
    if (!formData.telefono.trim()) camposErrores.telefono = "El teléfono de contacto es obligatorio.";

    setErrores(camposErrores);
    return Object.keys(camposErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        alert("Usuario actualizado con éxito.");
      } else {
        await axios.post(API_URL, formData);
        alert("Usuario registrado con éxito.");
      }
      resetearFormulario();
      listarUsuarios();
    } catch (error) {
      console.error("Error al procesar el usuario:", error);
      alert("Hubo un problema al guardar el usuario.");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        listarUsuarios();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario.");
      }
    }
  };

  const handleEditar = (usuario) => {
    setEditId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email || '',
      telefono: usuario.telefono || ''
    });
  };

  const resetearFormulario = () => {
    setFormData({ nombre: '', email: '', telefono: '' });
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
        color: '#2c5282', 
        marginBottom: '25px', 
        borderBottom: '2px solid #e2e8f0', 
        paddingBottom: '10px',
        fontWeight: '600'
      }}>
        Módulo de Gestión de Usuarios / Pacientes
      </h2>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '25px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
        marginBottom: '40px', 
        maxWidth: '500px' 
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#319795', fontSize: '18px' }}>
          {editId ? '🔄 Modificar Datos de Usuario' : '👤 Registrar Nuevo Usuario'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Nombre Completo:
            </label>
            <input 
              type="text" 
              placeholder="Ej: Tatiana Gómez" 
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
            {errores.nombre && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.nombre}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Correo Electrónico:
            </label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
            {errores.email && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.email}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
              Teléfono de Contacto:
            </label>
            <input 
              type="text" 
              placeholder="Ej: 3001234567" 
              value={formData.telefono} 
              onChange={e => setFormData({...formData, telefono: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
            {errores.telefono && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errores.telefono}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ 
              padding: '10px 20px', 
              backgroundColor: editId ? '#d69e2e' : '#319795', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1
            }}>
              {editId ? 'Actualizar Usuario' : 'Registrar Usuario'}
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

      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c5282', fontSize: '18px' }}>
          📋 Directorio de Usuarios Registrados
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e6fffa', color: '#234e52', borderBottom: '2px solid #b2f5ea' }}>
              <th style={{ padding: '12px 15px' }}>ID</th>
              <th style={{ padding: '12px 15px' }}>Nombre Completo</th>
              <th style={{ padding: '12px 15px' }}>Correo Electrónico</th>
              <th style={{ padding: '12px 15px' }}>Teléfono</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#718096', fontStyle: 'italic' }}>
                  No hay usuarios registrados en el sistema actualmente.
                </td>
              </tr>
            ) : (
              usuarios.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#4a5568' }}>{user.id}</td>
                  <td style={{ padding: '12px 15px', color: '#2d3748', fontWeight: '500' }}>{user.nombre}</td>
                  <td style={{ padding: '12px 15px', color: '#4a5568' }}>{user.email}</td>
                  <td style={{ padding: '12px 15px', color: '#4a5568' }}>
                    <span style={{ backgroundColor: '#f7fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #edf2f7', fontSize: '13px' }}>
                      {user.telefono || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEditar(user)} 
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
                      onClick={() => handleEliminar(user.id)} 
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
                      🗑️ Eliminar
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