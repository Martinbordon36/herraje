import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './CoeficienteScreen.css';

const CoeficienteScreen = () => {
  const [coeficientes, setCoeficientes] = useState([]);
  const [filteredCoeficientes, setFilteredCoeficientes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);  // Estado para alternar entre vista y edición
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCoeficientes = async () => {
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los coeficientes');
        }
        const data = await response.json();
        setCoeficientes(data);
        setFilteredCoeficientes(data);
      } catch (error) {
        console.error('Error fetching coeficientes:', error);
      }
    };

    fetchCoeficientes();

  }, [token]);

  // Función para manejar cambios en la descripción del coeficiente
  const handleDescripcionChange = (e, id) => {
    const newDescripcion = e.target.value;
    const updatedCoeficientes = coeficientes.map(coef => {
      if (coef.id === id) {
        const nuevoCoeficienteTotal = calcularCoeficienteTotal(newDescripcion);
        return { ...coef, detalleCoeficientes: newDescripcion, coeficienteTotal: nuevoCoeficienteTotal };
      }
      return coef;
    });
    setCoeficientes(updatedCoeficientes);
    setFilteredCoeficientes(updatedCoeficientes);
  };

  // Función para calcular el coeficiente total basado en la descripción (sumas y restas)
  const calcularCoeficienteTotal = (descripcion) => {
    let total = 1;
    let sumaPartes = descripcion.split('+'); // Separar por sumas
    sumaPartes.forEach(sumaParte => {
      let restaPartes = sumaParte.split('-'); // Separar cada suma por restas
      let subtotal = 1;
      restaPartes.forEach((parte, index) => {
        const valor = parseFloat(parte.replace(",", "."));
        if (index === 0) {
          subtotal *= (1 + valor / 100); // Sumar porcentaje
        } else {
          subtotal /= (1 + valor / 100); // Restar porcentaje
        }
      });
      total *= subtotal;
    });
    return total.toFixed(4); // Ajusta el número de decimales según sea necesario
  };

  // Función para guardar los cambios en el servidor
  const saveChanges = async (id, proveedor, zona, coeficienteTotal, detalleCoeficientes) => {
    const updatedData = [{
      idCoeficiente: id,
      idProveedor: proveedor,
      idZona: zona,
      coeficienteTotal: coeficienteTotal,
      descripcionCoeficiente: detalleCoeficientes
    }];

    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData) // Enviar el arreglo de objetos
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el coeficiente');
      }

      alert('Coeficiente actualizado con éxito');
    } catch (error) {
      console.error('Error updating coeficiente:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Coeficientes</h1>
        {/* Botón para alternar entre modo de vista y edición */}
        <button onClick={() => setIsEditing(!isEditing)} className='button-edit'>
          {isEditing ? 'Ver' : 'Editar'}
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Proveedor</th>
              <th className="th">Zona</th>
              <th className="th">Coeficiente</th>
              <th className="th">Descripción Coeficiente</th>
              {isEditing && <th className="th">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCoeficientes && filteredCoeficientes.map((coeficiente) => (
              <tr key={coeficiente.id}>
                <td className="td">{coeficiente.proveedor.razonSocial}</td>
                <td className="td">{coeficiente.zona.nombre}</td>
                <td className="td">{coeficiente.coeficienteTotal}</td>
                <td className="td">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={coeficiente.detalleCoeficientes || ""} 
                      onChange={(e) => handleDescripcionChange(e, coeficiente.id)}
                    />
                  ) : (
                    coeficiente.detalleCoeficientes
                  )}
                </td>
                {isEditing && (
                  <td>
                    <button onClick={() => saveChanges(coeficiente.id, coeficiente.proveedor.id, coeficiente.zona.id, coeficiente.coeficienteTotal, coeficiente.detalleCoeficientes)}
                       className='button-guardar'
                      >
                      Guardar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CoeficienteScreen;
