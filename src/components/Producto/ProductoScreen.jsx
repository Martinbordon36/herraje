import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Importar iconos de react-icons
import { Card, CardContent, Typography, Grid, Avatar, Modal, Fade, Backdrop, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  avatar: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  label: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  value: {
    color: theme.palette.text.primary,
    marginTop: theme.spacing(0.5),
    fontSize: '1.1rem',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

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
  const classes = useStyles();

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
        console.log(data);
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
      <br/>

      <div className="container">
        <h1 className="title">Productos</h1>
        
        <button className="button" onClick={handleCreateProduct}>Crear Producto</button>
     
      </div>

      
      <div className ="container-search">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar producto por descripcion"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-client"

        />
          <a onClick={handleSearch}>
            <img src={search} className='search-button'/>
          </a>
        {/* <button className="search-button" onClick={handleSearch}>
          Buscar
        </button> */}
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
      {/* {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Producto</h5>
                {/* <button type="button" className="close" onClick={closeDetailModal}>
                  <span>&times;</span>
                </button> 
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
      )} */}


<Modal
        open={showDetailModal}
        onClose={closeDetailModal}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showDetailModal}>
          <Card className={classes.card}>
            <IconButton className={classes.closeButton} onClick={closeDetailModal}>
              <CloseIcon />
            </IconButton>
            <div className={classes.header}>
              <Avatar className={classes.avatar}>
                <VisibilityIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" color="textPrimary">
                Detalles del Producto
              </Typography>
            </div>
            <CardContent>
              <Grid container spacing={3}>
     
                {selectedProducto && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>ID Producto:</Typography>
                      <Typography variant="body1" className={classes.value}>
                      {selectedProducto.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Codigo:</Typography>
                      <Typography variant="body1" className={classes.value}>
                      {selectedProducto.codigo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Descripción:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProducto.descripcion}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Punto de Reposición:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProducto.puntoReposicion}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Estado:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProducto.estado}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Costo:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProducto.costo}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Modal>

    </>
  );
};

export default ProductoScreen;
