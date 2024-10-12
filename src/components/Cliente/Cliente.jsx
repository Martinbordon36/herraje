import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaFileAlt } from 'react-icons/fa';
import Navbar from '../Others/Navbar';
import '../Producto/ProductoScreen.css';
import search from '../../assets/lupa.png';
import Footer from '../Others/Footer';
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

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const fetchClientes = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/paginacion?page=${currentPage}&size=30`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClientes(data.content);
        setFilteredClientes(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, [token, currentPage]);

  const handleCreateCliente = () => {
    navigate('/nuevoCliente');
  };

  const handleEdit = (id) => {
    navigate(`/editarCliente/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${selectedCliente.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      setClientes(clientes.filter((cliente) => cliente.id !== selectedCliente.id));
      setFilteredClientes(filteredClientes.filter((cliente) => cliente.id !== selectedCliente.id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      toast.success('Cliente eliminado con éxito');
    } catch (error) {
      console.error('Error deleting cliente:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const openConfirmModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedCliente(null);
    setShowConfirmModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const openDetailModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedCliente(null);
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
    if (searchTerm === '') {
      setFilteredClientes(clientes);
    } else {
      setFilteredClientes(
        clientes.filter((cliente) =>
          cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
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
      <br />

      <div className="container">
        <h1 className="title">Clientes</h1>
        <button className="button" onClick={handleCreateCliente}>
          Crear Cliente
        </button>
      </div>

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
            <img src={search} className='search-button' />
          </a>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID Cliente</th>
              <th className="th">Razón Social</th>
              <th className="th">CUIT</th>
              <th className="th">Domicilio</th>
              <th className="th">Teléfono</th>
              <th className="th">Email</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="td">{cliente.id}</td>
                <td className="td">{cliente.razonSocial}</td>
                <td className="td">{cliente.cuit}</td>
                <td className="td">{cliente.domicilio}</td>
                <td className="td">{cliente.telefono}</td>
                <td className="td">{cliente.email}</td>
                <td className="td">
                  <FaFileAlt
                    className="icon view-icon"
                    onClick={() => navigate(`/facturaCliente/${cliente.id}`)}
                  />
                  <FaEye
                    className="icon view-icon"
                    onClick={() => openDetailModal(cliente)}
                  />
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => handleEdit(cliente.id)}
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => openConfirmModal(cliente)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-info">
        <span className="numpag">
          Página {currentPage + 1} de {totalPages}
        </span>

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
      </div>

      <ToastContainer />

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar el cliente {selectedCliente.razonSocial}?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeConfirmModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Cliente */}
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
                Detalles del Cliente
              </Typography>
            </div>
            <CardContent>
              <Grid container spacing={3}>
                {selectedCliente && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>ID Cliente:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Razón Social:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.razonSocial}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>CUIT:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.cuit}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Domicilio:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.domicilio}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Teléfono:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.telefono}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Email:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Provincia:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.provincia}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Typography className={classes.label}>Localidad:</Typography>
                      <Typography variant="body1" className={classes.value}>
                        {selectedCliente.localidad}
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

export default Cliente;
