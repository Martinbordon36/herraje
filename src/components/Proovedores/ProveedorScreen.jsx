import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaFileAlt } from 'react-icons/fa'; // Importar iconos de react-icons
import search from '../../assets/lupa.png';
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { Card, CardContent, Typography, Grid, Avatar, Modal, Fade, Backdrop, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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

const ProveedorScreen = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // Agregado para el modal de detalles
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const fetchProveedores = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/paginacion?page=${currentPage}&size=50`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los proveedores');
        }
        const data = await response.json();
        setProveedores(data.content);
        setFilteredProveedores(data.content); // Set initial filtered list
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, [token, currentPage]);

  const handleCreateProveedor = () => {
    navigate('/nuevoproveedor');
  };

  const handleEdit = (id) => {
    navigate(`/editarproveedor/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${selectedProveedor.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el proveedor');
      }
      const updatedProveedores = proveedores.filter(proveedor => proveedor.id !== selectedProveedor.id);
      setProveedores(updatedProveedores);
      setFilteredProveedores(updatedProveedores); // Update filtered list
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      toast.success('Proveedor eliminado con éxito');
    } catch (error) {
      console.error('Error deleting proveedor:', error);
    }
  };

  const openConfirmModal = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedProveedor(null);
    setShowConfirmModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const openDetailModal = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProveedor(null);
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
    const searchResult = proveedores.filter(proveedor =>
      proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProveedores(searchResult);
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
        <h1 className="title">Proveedores</h1>
        <button className="button" onClick={handleCreateProveedor}>Crear Proveedor</button>

      </div>
      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Razón Social"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="button" onClick={handleSearch}>Buscar</button>
      </div> */}

      <div className='container-search'>
      <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por Razón Social"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-client"
          />
          <a onClick={handleSearch}>
            <img src={search} className='search-button'/>
          </a>
          {/* <button onClick={handleSearch} className="search-button">
            Buscar
          </button> */}
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de proveedor</th>
              <th className="th">Razón Social</th>
              <th className="th">CUIT</th>
              <th className="th">Domicilio</th>
              <th className="th">Teléfono</th>
              <th className="th">Email</th>
              {/*   <th className="th">Provincia</th>
             <th className="th">Localidad</th>*/}
              <th className="th">Acciones</th> 
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td className="td">{proveedor.id}</td>
                <td className="td">{proveedor.razonSocial}</td>
                <td className="td">{proveedor.cuit}</td>
                <td className="td">{proveedor.domicilio}</td>
                <td className="td">{proveedor.telefono}</td>
                <td className="td">{proveedor.email}</td>
                {/* <td className="td">{proveedor.provincia}</td>
                <td className="td">{proveedor.localidad}</td> */}
                <td className="td">
                <FaFileAlt 
                    className="icon view-icon" 
                    onClick={() => navigate(`/facturaProveedores/${proveedor.id}`)} // Redirigir a la vista de facturas del cliente
                  />
                  <FaEye 
                    className="icon view-icon" 
                    onClick={() => openDetailModal(proveedor)} 
                  />
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(proveedor.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => openConfirmModal(proveedor)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-info">
        <span className='numpag'>Página {currentPage + 1} de {totalPages}</span>
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


      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el proveedor {selectedProveedor.razonSocial}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
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
                <h5 className="modal-title">Proveedor Eliminado</h5>
              </div>
              <div className="modal-body">
                <p>Proveedor eliminado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <AccountCircleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" color="textPrimary">
                Detalles del Proveedor
              </Typography>
            </div>
            <CardContent>
              <Grid container spacing={3}>
                {selectedProveedor && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>ID Proveedor:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Razón Social:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.razonSocial}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>CUIT:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.cuit}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Domicilio:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.domicilio}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Teléfono:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.telefono}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Email:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Provincia:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.provincia}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Localidad:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedProveedor.localidad}
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

export default ProveedorScreen;
