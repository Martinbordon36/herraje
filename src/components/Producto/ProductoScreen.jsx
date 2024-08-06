import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Importar iconos de react-icons

const ProductoScreen = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productoIdAEliminar, setProductoIdAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // Agregado para el modal de detalles
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/paginacion?page=${currentPage}&size=30`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data.content);
        setFilteredProductos(data.content); // Inicializar productos filtrados
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [token, currentPage]);

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
      setFilteredProductos(filteredProductos.filter(producto => producto.id !== productoIdAEliminar)); // Actualizar productos filtrados
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const openDetailModal = (producto) => {
    setSelectedProducto(producto);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProducto(null);
    setShowDetailModal(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = () => {
    setFilteredProductos(
      productos.filter((producto) =>
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };
  

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Productos</h1>
        <button className="button" onClick={handleCreateProduct}>Crear Producto</button>
     

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar producto por descripcion"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-client"

        />
        <button className="search-button" onClick={handleSearch}>
          Buscar
        </button>
      </div>


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
            {filteredProductos.map((producto) => (
              <tr key={producto.id}>
                <td className="td">{producto.id}</td>
                <td className="td">{producto.codigo}</td>
                <td className="td">{producto.codigoOrig}</td>
                <td className="td">{producto.descripcion}</td>
                <td className="td">{producto.puntoReposicion}</td>
                <td className="td">{producto.estado}</td>
                <td className="td">{producto.costo}</td>
                <td className="td">
                  <FaEye 
                    className="icon view-icon" 
                    onClick={() => openDetailModal(producto)} 
                  />
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
      
      <div className='prueba1'>
        <div className='prueba2'>
          <span className='numpag'>{currentPage + 1} de {totalPages}</span>
        </div>
      </div>

      <div className="pagination">
  <div className="pagination-buttons">
    <button className="button" id="bt" onClick={handleFirstPage} disabled={currentPage === 0}>
      Primera Página
    </button>
    <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
      Página Anterior
    </button>
    <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
      Página Siguiente
    </button>
    <button className="button" id="bt" onClick={handleLastPage} disabled={currentPage === totalPages - 1}>
      Última Página
    </button>
  </div>
</div>


      {/* <div className="pagination">
        <div className="pagination-buttons">
          <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Página Anterior
          </button>
          <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Página Siguiente
          </button>
        </div>
      </div> */}

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
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

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto Eliminado</h5>
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

      {/* Modal de Detalles del Producto */}
      {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Producto</h5>
                {/* <button type="button" className="close" onClick={closeDetailModal}>
                  <span>&times;</span>
                </button> */}
              </div>
              <div className="modal-body">
                {selectedProducto && (
                  <div>
                    <p><strong>ID:</strong> {selectedProducto.id}</p>
                    <p><strong>Código:</strong> {selectedProducto.codigo}</p>
                    <p><strong>Código Original:</strong> {selectedProducto.codigoOrig}</p>
                    <p><strong>Descripción:</strong> {selectedProducto.descripcion}</p>
                    <p><strong>Punto de Reposición:</strong> {selectedProducto.puntoReposicion}</p>
                    <p><strong>Estado:</strong> {selectedProducto.estado}</p>
                    <p><strong>Costo:</strong> {selectedProducto.costo}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeDetailModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoScreen;
