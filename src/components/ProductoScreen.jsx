import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos de react-icons
import Footer from './Footer';

const ProductoScreen = () => {
  const [productos, setProductos] = useState([]);
  const [productoIdAEliminar, setProductoIdAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/producto', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const handleCreateProduct = () => {
    navigate('/nuevoproductos');
  };

  const handleEdit = (id) => {
    navigate(`/editarproducto/${id}`);
  };

  const handleDelete = (id) => {
    setProductoIdAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/${productoIdAEliminar}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProductos(productos.filter(producto => producto.id !== productoIdAEliminar));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Productos</h1>
        <button className="button" onClick={handleCreateProduct}>Crear Producto</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de producto</th>
              <th className="th">Código</th>
              <th className="th">Código Original</th>
              <th className="th">Descripción</th>
              <th className="th">Punto de Reposición</th>
              <th className="th">Estado</th>
              <th className="th">Costo</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="td">{producto.id}</td>
                <td className="td">{producto.codigo}</td>
                <td className="td">{producto.codigoOrig}</td>
                <td className="td">{producto.descripcion}</td>
                <td className="td">{producto.puntoReposicion}</td>
                <td className="td">{producto.estado}</td>
                <td className="td">{producto.costo}</td>
                <td className="td">
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(producto.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => handleDelete(producto.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="close" onClick={() => setShowConfirmModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres eliminar este producto?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto Eliminado</h5>
                <button type="button" className="close" onClick={closeSuccessModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>El producto ha sido eliminado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoScreen;
