import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Others/Navbar';

const ActualizarPrecios = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedOption, setSelectedOption] = useState('proveedor');
  const [searchTerm, setSearchTerm] = useState('');
  const [porcentaje, setPorcentaje] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allSelected, setAllSelected] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Obtener proveedores y categorías
    fetchProveedores();
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [currentPage]);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria');
      console.log('Categorias:', response.data); // Verifica la estructura de los datos
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/paginacion?page=${currentPage}&size=50`);
      setProductos(response.data.content);
      setTotalPages(response.data.totalPages);
      setAllSelected(true);
      setSelectedProducts(response.data.content.map(producto => producto.id));
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchProductosByProveedor = async (proveedorId) => {
    try {
      const response = await axios.get(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/proveedor/${proveedorId}`);
      setProductos(response.data);
      setAllSelected(true);
      setSelectedProducts(response.data.map(producto => producto.id));
    } catch (error) {
      console.error('Error al obtener productos por proveedor:', error);
    }
  };

  const fetchProductosByCategoria = async (categoriaId) => {
    try {
      const response = await axios.get(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/categoria/${categoriaId}`);
      setProductos(response.data);
      setAllSelected(true);
      setSelectedProducts(response.data.map(producto => producto.id));
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
    }
  };

  const fetchProductosByDescripcion = async (descripcion) => {
    try {
      const response = await axios.get(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/descripcion?query=${descripcion}`);
      console.log("Esto hay en response..data" + response.data)
      setProductos(response.data);
      console.log('Desde producto por descripcion' + response.data)
      setAllSelected(true);
      setSelectedProducts(response.data.map(producto => producto.id));
    } catch (error) {
      console.error('Error al obtener productos por descripción:', error);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSearch = () => {
    if (selectedOption === 'proveedor') {
      fetchProductosByProveedor(searchTerm);
    } else if (selectedOption === 'categoria') {
      fetchProductosByCategoria(searchTerm);
    } else if (selectedOption === 'descripcion') {
      fetchProductosByDescripcion(searchTerm);
    }
  };

  const handlePercentageChange = (e) => {
    setPorcentaje(e.target.value);
  };

  const handleSelectAll = (e) => {
    setAllSelected(e.target.checked);
    setSelectedProducts(e.target.checked ? productos.map(producto => producto.id) : []);
  };

  const handleProductSelect = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const aplicarPorcentaje = async () => {
    let payload = {
      idProveedor: "",
      idCategoria: "",
      idSubcategoria: "",
      porcentaje: porcentaje,
      productos: selectedProducts.map(id => ({ id }))
    };

    if (selectedOption === 'proveedor') {
      payload.idProveedor = searchTerm;
    } else if (selectedOption === 'categoria') {
      payload.idCategoria = searchTerm;
    } else if (selectedOption === 'descripcion') {
      // En este caso no hay que modificar el payload, ya está preparado
    }

    try {
      console.log(payload); // Puedes revisar aquí cómo se construye el payload
      const response = await axios.post('http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/actualizarPrecio', payload);
      console.log('Precios actualizados:', response.data);
      // Aquí podrías mostrar una notificación de éxito o actualizar el estado si es necesario
    } catch (error) {
      console.error('Error al actualizar precios:', error);
      // Manejar errores según sea necesario
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://vps-1915951-x.dattaweb.com:8090/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Archivo subido:', response.data);
      // Aquí puedes manejar la respuesta después de subir el archivo
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
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
      <div className="container mt-5">
        <h1 className="mb-4">Actualizar Precios</h1>
        <div className="mb-3">
          <label className="form-check-label me-3">
            <input
              type="radio"
              value="proveedor"
              checked={selectedOption === 'proveedor'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            Proveedor
          </label>
          <label className="form-check-label me-3">
            <input
              type="radio"
              value="categoria"
              checked={selectedOption === 'categoria'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            Categoría
          </label>
          <label className="form-check-label me-3">
            <input
              type="radio"
              value="descripcion"
              checked={selectedOption === 'descripcion'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            Descripción
          </label>
          <label className="form-check-label">
            <input
              type="radio"
              value="subirArchivo"
              checked={selectedOption === 'subirArchivo'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            Subir Archivo
          </label>
        </div>
        <div className="mb-3">
          {selectedOption === 'proveedor' && (
            <select className="form-select" onChange={(e) => setSearchTerm(e.target.value)}>
              {proveedores.map(proveedor => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.razonSocial}
                </option>
              ))}
            </select>
          )}
          {selectedOption === 'categoria' && (
            <select className="form-select" onChange={(e) => setSearchTerm(e.target.value)}>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descripcion} {/* Asegúrate de usar la propiedad correcta aquí */}
                </option>
              ))}
            </select>
          )}
          {selectedOption === 'descripcion' && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripción"
              className="form-control"
            />
          )}
          {selectedOption === 'subirArchivo' && (
            <div>
              <input
                type="file"
                accept=".xls,.csv"
                onChange={handleFileChange}
                className="form-control"
              />
              <button className="btn btn-primary mt-3" onClick={handleFileUpload}>Subir Archivo</button>
            </div>
          )}
          {selectedOption !== 'subirArchivo' && (
            <button className="btn btn-primary mt-3" onClick={handleSearch}>Buscar</button>
          )}
        </div>
        <div className="mb-3">
          <label>
            Porcentaje:
            <input
              type="number"
              value={porcentaje}
              onChange={handlePercentageChange}
              className="form-control"
              style={{ width: '100px', display: 'inline-block', marginLeft: '10px' }}
            />
          </label>
          <button className="btn btn-success ms-3" onClick={aplicarPorcentaje}>Aplicar</button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>
                <label>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                  Seleccionar todo
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.costo}</td>
                <td>{producto.precioVenta}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(producto.id)}
                    onChange={() => handleProductSelect(producto.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
    </>
  );
};

export default ActualizarPrecios;