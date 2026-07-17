import Usuarios from './pages/Usuarios'; // ⬅️ Se quitaron las llaves
import Citas from './pages/Citas';       // ⬅️ Se quitaron las llaves

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', backgroundColor: '#333', color: 'white', padding: '15px', margin: '0 0 20px 0' }}>
        Sistema de Gestión Médica - Saludría
      </h1>
      
      {/* Renderizamos ambos módulos separados por una línea visual */}
      <Usuarios />
      <hr style={{ margin: '40px 0', border: '1px solid #ccc' }} />
      <Citas />
    </div>
  );
}

export default App;