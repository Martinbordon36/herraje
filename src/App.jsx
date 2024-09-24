import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './components/Login/LoginScreen';
//import Home from './Home'; // Asegúrate de tener un componente Home
import SignUpScreen from './components/Login/SignUpScreen';
import ProductoForm from './components/Producto/ProductoForm';
import Clasificaciones from './components/Categoria/Clasificaciones';
import ProductoScreen from './components/Producto/ProductoScreen';
import Proveedores from './components/Proovedores/Proveedores';
import Categorias from './components/Categoria/Categorias';
//import Pedidos from './components/Pedidos';
import CategoriaScreen from './components/Categoria/CategoriaScreen';
import SubcategoriaScreen from './components/Categoria/SubcategoriaScreen';
import CrearPedido from './components/Pedido/CrearPedido';
import PedidoScreen from './components/Pedido/PedidoScreen';
import ClienteScreen from './components/Cliente/ClienteScreen';
import ProveedorScreen from './components/Proovedores/ProveedorScreen';
import Cliente from './components/Cliente/Cliente';
import VerPedido from './components/Pedido/VerPedido';
import Footer from './components/Others/Footer';
import ActualizarPrecios from './components/Producto/ActualizarPrecios';
import CrearFactura from './components/Factura/CrearFactura';
import FacturaScreen from './components/Factura/FacturaScreen';
import FacturaView from './components/Factura/FacturaView';
import CrearPresupuesto from './components/Presupuesto/CrearPresupuesto';
import CoeficienteScreen from './components/Zonas/CoeficienteScreen';
import ZonasView from './components/Zonas/ZonasView';
import ListaPrecioExcel from './components/Producto/ListaPrecioExcel';
import CrearFacturaCompra from './components/FacturaCompra/CrearFacturaCompra';
import FacturaCompraScreen from './components/FacturaCompra/FacturaCompraScreen';
import FacturaCompraView from './components/FacturaCompra/FacturaCompraView';
import FacturaCliente from './components/Factura/FacturaCliente';
import FacturaProveedores from './components/Factura/FacturaProveedores';

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
        <Route path="/actualizarPrecios" element={<ActualizarPrecios />} />
        <Route path="/crearFactura" element={<CrearFactura />} />
        <Route path="/facturas" element={<FacturaScreen />} />
        <Route path="/verFactura/:id" element={<FacturaView />} />
        <Route path="/nuevoPresupuesto" element={<CrearPresupuesto />} />
        <Route path="/modificarCoeficientes" element={<CoeficienteScreen />} />
        <Route path="/zonas" element={<ZonasView />} />
        <Route path="/generarExcel" element={<ListaPrecioExcel />} />
        <Route path="/crearFacturaCompra" element={<CrearFacturaCompra />} />
        <Route path="/FacturasCompra" element={<FacturaCompraScreen/>} />
        <Route path="/verFacturaCompra/:id" element={<FacturaCompraView />} />
        <Route path="/facturaCliente/:id" element={<FacturaCliente />} />
        <Route path="/facturaProveedores/:id" element={<FacturaProveedores />} />

      </Routes>
      <Footer/>
    </Router>

  );
};

export default App;
