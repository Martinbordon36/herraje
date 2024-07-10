import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductoForm.css';

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    codigo: '',
    codigoOriginal: '',
    descripcion: '',
    unidadMedida: '',
    puntoReposicion: '',
    costo: '',
    estado: 'activo',
    unidadCompra: '',
    precioVenta: '',
    unidadVenta: '',
    artDtoGan: '',
    idProveedor: '',
    idCategoria: '',
    idSubCategoria: '',
    idUsuario: 1 // Asignar un idUsuario fijo o dinámico según sea necesario
  });

  const [categorias, setCategorias] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Este es el token ' + token)
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCategorias(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    const fetchProducto = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        console.error('Error fetching producto:', error);
      }
    };

    fetchCategorias();
    fetchProducto();
  }, [token, id]);

  const handleCategoriaChange = async (e) => {
    const value = e.target.value;
    setProducto({ ...producto, idCategoria: value });
    try {
      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/subcategoria', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const filteredSubCategorias = data.filter(subCategoria => subCategoria.categoria === parseInt(value));
      setSubCategorias(filteredSubCategorias);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(producto);
    const url = id 
      ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/${id}` 
      : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/producto';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(id ? 'Error al editar el producto' : 'Error al crear el producto');
      }
      return response.json();
    })
    .then(data => {
      console.log(id ? 'Producto editado:' : 'Producto creado:', data);
      navigate('/productos');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">{id ? 'Editar Producto' : 'Crear Producto'}</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="codigo" className="form-label">(*) Código</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    className="form-control"
                    value={producto.codigo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="codigoOriginal" className="form-label">(*) Código Original</label>
                  <input
                    type="text"
                    id="codigoOriginal"
                    name="codigoOriginal"
                    className="form-control"
                    value={producto.codigoOriginal}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="descripcion" className="form-label">(*) Descripción</label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    value={producto.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="unidadMedida" className="form-label">(*) Unidad de Medida</label>
                  <input
                    type="text"
                    id="unidadMedida"
                    name="unidadMedida"
                    className="form-control"
                    value={producto.unidadMedida}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="puntoReposicion" className="form-label">(*) Punto de Reposición</label>
                  <input
                    type="number"
                    id="puntoReposicion"
                    name="puntoReposicion"
                    className="form-control"
                    value={producto.puntoReposicion}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="costo" className="form-label">(*) Costo</label>
                  <input
                    type="number"
                    id="costo"
                    name="costo"
                    className="form-control"
                    value={producto.costo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="estado" className="form-label">(*) Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-select"
                    value={producto.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="unidadCompra" className="form-label">(*) Unidad de Compra</label>
                  <input
                    type="number"
                    id="unidadCompra"
                    name="unidadCompra"
                    className="form-control"
                    value={producto.unidadCompra}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="precioVenta" className="form-label">(*) Precio de Venta</label>
                  <input
                    type="number"
                    id="precioVenta"
                    name="precioVenta"
                    className="form-control"
                    value={producto.precioVenta}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="unidadVenta" className="form-label">(*) Unidad de Venta</label>
                  <input
                    type="number"
                    id="unidadVenta"
                    name="unidadVenta"
                    className="form-control"
                    value={producto.unidadVenta}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="artDtoGan" className="form-label">(*) Art Dto Gan</label>
                  <input
                    type="number"
                    id="artDtoGan"
                    name="artDtoGan"
                    className="form-control"
                    value={producto.artDtoGan}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="idCategoria" className="form-label">(*) Categoría</label>
                  <select
                    id="idCategoria"
                    name="idCategoria"
                    className="form-select"
                    value={producto.idCategoria}
                    onChange={handleCategoriaChange}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="idSubCategoria" className="form-label">(*) SubCategoría</label>
                  <select
                    id="idSubCategoria"
                    name="idSubCategoria"
                    className="form-select"
                    value={producto.idSubCategoria}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una subcategoría</option>
                    {subCategorias.map(subCategoria => (
                      <option key={subCategoria.id} value={subCategoria.id}>
                        {subCategoria.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="idProveedor" className="form-label">(*) Proveedor</label>
                  <input
                    type="text"
                    id="idProveedor"
                    name="idProveedor"
                    className="form-control"
                    value={producto.idProveedor}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <button className="btn btn-secondary w-100" type="button" onClick={handleBack}>Volver Atrás</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-primary w-100" type="submit">{id ? 'Guardar Cambios' : 'Crear Producto'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductoForm;
