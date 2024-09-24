import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css'; // Puedes mantener el mismo estilo o crear uno para clientes
import { FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const FacturaCliente = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [selectedFacturas, setSelectedFacturas] = useState([]); // Facturas seleccionadas para pago
  const [paymentType, setPaymentType] = useState(''); // Tipo de pago seleccionado
  const [chequeInfo, setChequeInfo] = useState(''); // Información del cheque en caso de ser seleccionado
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Mostrar formulario de pago
  const [payments, setPayments] = useState([]); // Historial de pagos
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el ID del cliente desde la URL

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturaventa`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        const facturasFiltradas = data.filter(factura => factura.cliente.toString() === id);

        const clientePromises = facturasFiltradas.map(factura => 
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${factura.cliente}`)
            .then(res => res.json())
            .then(clienteData => ({
              id: factura.cliente,
              razonSocial: clienteData.razonSocial
            }))
        );
        const clientesData = await Promise.all(clientePromises);
        const clientesMap = {};
        clientesData.forEach(cliente => {
          clientesMap[cliente.id] = cliente.razonSocial;
        });
        setClientes(clientesMap);
        setFacturas(facturasFiltradas || []);
        setFilteredFacturas(facturasFiltradas || []);
        
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, id]);

  const handleSelectFactura = (facturaId) => {
    setSelectedFacturas((prevSelected) =>
      prevSelected.includes(facturaId)
        ? prevSelected.filter((id) => id !== facturaId)
        : [...prevSelected, facturaId]
    );
  };

  const handlePaymentSubmit = async () => {
    try {
      const paymentData = {
        facturaIds: selectedFacturas, // Pagar todas las facturas seleccionadas
        tipoPago: paymentType,
        chequeInfo: paymentType === 'cheque' ? chequeInfo : null,
      };

      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pagarFactura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el pago');
      }

      // Actualizar el estado de las facturas a "pagada"
      setFacturas((prevFacturas) =>
        prevFacturas.map((factura) =>
          selectedFacturas.includes(factura.id) ? { ...factura, estado: 'pagada' } : factura
        )
      );

      // Agregar pago al historial
      const newPayments = selectedFacturas.map((facturaId) => ({
        id: facturaId,
        tipoPago: paymentType,
        monto: facturas.find(factura => factura.id === facturaId).total,
        chequeInfo: paymentType === 'cheque' ? chequeInfo : null
      }));
      setPayments((prevPayments) => [...prevPayments, ...newPayments]);

      setSelectedFacturas([]); // Limpiar la selección después del pago
      setShowPaymentForm(false); // Ocultar el formulario de pago
    } catch (error) {
      console.error('Error registrando el pago:', error);
    }
  };

  const mapTipoFactura = (tipo) => {
    const tipoNumerico = Number(tipo);
    switch(tipoNumerico) {
      case 1:
        return 'A';
      case 2:
        return 'N';
      default:
        return tipo;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-grid">
        <div className="left-panel">
          <h1 className="title">Facturas de Cliente</h1>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Seleccionar</th>
                  <th className="th">#ID de Factura</th>
                  <th className="th">Fecha</th>
                  <th className="th">Tipo de Factura</th>
                  <th className="th">Razón Social Cliente</th>
                  <th className="th">Total</th>
                  <th className="th">Estado</th>
                  <th className="th">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacturas.length > 0 ? (
                  filteredFacturas.map((factura) => (
                    <tr key={factura.id}>
                      <td className="td">
                        {factura.estado !== 'pagada' && (
                          <input
                            type="checkbox"
                            checked={selectedFacturas.includes(factura.id)}
                            onChange={() => handleSelectFactura(factura.id)}
                          />
                        )}
                      </td>
                      <td className="td">{factura.id}</td>
                      <td className="td">{new Date(factura.fecha).toLocaleString()}</td>
                      <td className="td">{mapTipoFactura(factura.tipoFactura)}</td>
                      <td className="td">{clientes[factura.cliente] || factura.cliente}</td>
                      <td className="td">{factura.total}</td>
                      <td className="td">{factura.estado}</td>
                      <td className="td">
                        <FaEye
                          className="icon view-icon"
                          onClick={() => navigate(`/verFactura/${factura.id}`)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="td">No se encontraron facturas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Botón Pagar general */}
          <button
            className="btn-submit"
            onClick={() => setShowPaymentForm(true)}
            disabled={selectedFacturas.length === 0}
          >
            Pagar
          </button>
        </div>

        {/* Panel Derecho: Formulario de Pago */}
        <div className="right-panel">
          {showPaymentForm && (
            <div className="payment-form">
              <h3>Pagar {selectedFacturas.length} Factura(s)</h3>
              <label>Tipo de Pago:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="select-pay"
              >
                <option value="contado">Contado</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
              </select>

              {paymentType === 'cheque' && (
                <>
                  <label>Registrar Cheque:</label>
                  <input
                    type="text"
                    value={chequeInfo}
                    onChange={(e) => setChequeInfo(e.target.value)}
                    placeholder="Ingrese los datos del cheque"
                  />
                </>
              )}

              <button className="btn-submit" onClick={handlePaymentSubmit}>
                Confirmar Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Registro de Pagos */}
      <div className="payment-history">
        <h2>Historial de Pagos</h2>
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de Factura</th>
              <th className="th">Tipo de Pago</th>
              <th className="th">Monto</th>
              <th className="th">Cheque (si aplica)</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((pago, index) => (
                <tr key={index}>
                  <td className="td">{pago.id}</td>
                  <td className="td">{pago.tipoPago}</td>
                  <td className="td">{pago.monto}</td>
                  <td className="td">{pago.chequeInfo || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="td">No se han registrado pagos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-info">
        <span className="numpag">Página {currentPage} de {totalPages}</span>
      </div>
    </>
  );
};

export default FacturaCliente;
