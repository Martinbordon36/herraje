import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
//import Home from './Home'; // Asegúrate de tener un componente Home
import SignUpScreen from './components/SignUpScreen';
import ProductoForm from './components/ProductoForm';
import Clasificaciones from './components/Clasificaciones';
import ProductoScreen from './components/ProductoScreen';
import Proveedores from './components/Proveedores';
import Categorias from './components/Categorias';
//import Pedidos from './components/Pedidos';
import CategoriaScreen from './components/CategoriaScreen';
import SubcategoriaScreen from './components/SubcategoriaScreen';
import CrearPedido from './components/CrearPedido';
import PedidoScreen from './components/PedidoScreen';
import ClienteScreen from './components/ClienteScreen';
import ProveedorScreen from './components/ProveedorScreen';
import Cliente from './components/Cliente';
import VerPedido from './components/VerPedido';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/crearusuario" element={<SignUpScreen />} />
        <Route path="/nuevoproductos" element={<ProductoForm />} />
        <Route path="/clasificaciones" element={<Clasificaciones />} />
        <Route path="/productos" element={<ProductoScreen />} />
        <Route path="/nuevoProveedor" element={<Proveedores />} />
        <Route path="/nuevacategoria" element={<Categorias />} />
        <Route path="/pedidos" element={<PedidoScreen />} />
        <Route path="/editarproducto/:id" element={<ProductoForm />} />
        <Route path="/categorias" element={<CategoriaScreen />} />
        <Route path="/subcategoria/:id" element={<SubcategoriaScreen />} />
        <Route path="nuevoPedido" element={<CrearPedido />} />
        <Route path="/editarPedido/:id" element={<CrearPedido />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/proveedores" element={<ProveedorScreen />} />
        <Route path="/nuevoCliente" element={<ClienteScreen />} />
        <Route path="/editarproveedor/:id" element={<Proveedores />} />
        <Route path="/editarCliente/:id" element={<ClienteScreen />} />
        <Route path="/editarCategoria/:id" element={<Clasificaciones />} />
        <Route path="/verPedido/:id" element={<VerPedido />} />

      </Routes>
    </Router>
  );
};

export default App;
