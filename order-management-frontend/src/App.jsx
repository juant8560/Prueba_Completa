import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ClientesPage from "./pages/ClientesPage";
import ProductosPage from "./pages/ProductosPage";
import OrdenesPage from "./pages/OrdenesPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        {/* Menú de navegación */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <Link className="nav-link" to="/clientes">Clientes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/productos">Productos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ordenes">Ordenes</Link>
          </li>
        </ul>

        {/* Rutas */}
        <Routes>
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
          <Route path="*" element={<p>Seleccione una opción del menú</p>} />
        </Routes>
      </div>
    </Router>
  );
}
