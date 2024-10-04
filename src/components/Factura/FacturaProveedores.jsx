import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css';
import { FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const FacturaProveedores = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [selectedFacturas, setSelectedFacturas] = useState([]); // Facturas seleccionadas para pago
  const [paymentType, setPaymentType] = useState(''); // Tipo de pago seleccionado
  const [chequeInfo, setChequeInfo] = useState(''); // Información del cheque en caso de ser seleccionado
  const [monto, setMonto] = useState(''); // Monto a ingresar para pago parcial
  const [montoPagoTotal, setMontoPagoTotal] = useState(false); // Estado para controlar si es "pago total"
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Mostrar formulario de pago
  const [payments, setPayments] = useState([]); // Historial de pagos
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el ID del proveedor desde la URL

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las facturas de proveedores');
        }
        const data = await response.json();
        const facturasFiltradas = data.filter(factura => factura.proveedor.toString() === id);

        const proveedorPromises = facturasFiltradas.map(factura => 
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${factura.proveedor}`)
            .then(res => res.json())
            .then(proveedorData => ({
              id: factura.proveedor,
              razonSocial: proveedorData.razonSocial
            }))
        );
        const proveedoresData = await Promise.all(proveedorPromises);
        const proveedoresMap = {};
        proveedoresData.forEach(proveedor => {
          proveedoresMap[proveedor.id] = proveedor.razonSocial;
        });
        setProveedores(proveedoresMap);
        setFacturas(facturasFiltradas || []);
        setFilteredFacturas(facturasFiltradas || []);
        
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, id]);

  const calcularMontoTotalFacturas = () => {
    return selectedFacturas.reduce((total, facturaId) => {
      const factura = facturas.find(f => f.id === facturaId);
      return total + (factura ? factura.total : 0);
    }, 0);
  };

  const handleSelectFactura = (facturaId) => {
    setSelectedFacturas((prevSelected) =>
      prevSelected.includes(facturaId)
        ? prevSelected.filter((id) => id !== facturaId)
        : [...prevSelected, facturaId]
    );
  };

  const handlePaymentSubmit = async () => {
    const totalFacturas = calcularMontoTotalFacturas();

    // Caso N° 1: Pago total con contado o transferencia
    if (montoPagoTotal && (paymentType === 'contado' || paymentType === 'transferencia')) {
      setMonto(totalFacturas); // El monto será el total de las facturas
      // Continuar con el proceso de pago
    }

    // Caso N° 2: Pago con cheque (generar nota de crédito si el cheque es mayor)
    if (montoPagoTotal && paymentType === 'cheque') {
      if (chequeInfo > totalFacturas) {
        const notaCredito = chequeInfo - totalFacturas;
        alert(`Cheque mayor al total. Se generará una nota de crédito de ${notaCredito} pesos.`);
        // Generar nota de crédito y registrar el pago
      }
      // Si el cheque es igual al total, registrar el pago directamente
    }

    // Caso N° 3: Pago parcial (repartir el monto entre las facturas seleccionadas)
    if (!montoPagoTotal && monto > 0) {
      let montoRestante = monto;

      // Ordenar las facturas para pagar en secuencia
      const facturasOrdenadas = selectedFacturas.map(facturaId => facturas.find(f => f.id === facturaId)).sort((a, b) => a.total - b.total);

      for (let factura of facturasOrdenadas) {
        if (montoRestante >= factura.total) {
          montoRestante -= factura.total;
          factura.estado = 'pagada'; // Pagar la factura completamente
        } else {
          // Pagar parte de la factura
          factura.total -= montoRestante;
          montoRestante = 0;
          break;
        }
      }

      if (paymentType === 'cheque' && chequeInfo > monto) {
        alert('El monto del cheque no puede ser mayor al monto ingresado. Debe seleccionar un cheque exacto.');
        return;
      }
    }

    try {
      const paymentData = {
        facturaIds: selectedFacturas,
        tipoPago: paymentType,
        monto: montoPagoTotal ? totalFacturas : monto,
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

      setMonto(''); // Limpiar el campo de monto
      setChequeInfo(''); // Limpiar el campo de cheque
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
      case 3:
        return '50 50';
      default:
        return tipo;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-grid">
        <div className="left-panel">
          <h1 className="title">Facturas de Proveedores</h1>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Seleccionar</th>
                  <th className="th">#ID de Factura</th>
                  <th className="th">Fecha</th>
                  <th className="th">Tipo de Factura</th>
                  <th className="th">Razón Social Proveedor</th>
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
                      <td className="td">{proveedores[factura.proveedor] || factura.proveedor}</td>
                      <td className="td">{factura.total}</td>
                      <td className="td">{factura.estado}</td>
                      <td className="td">
                        <FaEye
                          className="icon view-icon"
                          onClick={() => navigate(`/verFacturaCompra/${factura.id}`)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="td">No se encontraron facturas de proveedores.</td>
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
              
              <label>¿Es un pago total?</label>
              <select
                value={montoPagoTotal}
                onChange={(e) => setMontoPagoTotal(e.target.value === 'true')}
              >
                <option value="false">Pagar otro monto</option>
                <option value="true">Pagar el total</option>
              </select>

              {/* Si es un pago total, mostramos el total calculado */}
              {montoPagoTotal && (
                <div>
                  <p><strong>Total a pagar:</strong> {calcularMontoTotalFacturas().toFixed(2)} pesos</p>
                </div>
              )}

              {/* Si no es un pago total, se muestra el campo para ingresar monto */}
              {!montoPagoTotal && (
                <>
                  <label>Monto:</label>
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Ingrese el monto"
                  />
                </>
              )}

              <label>Tipo de Pago:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="select-pay"
              >
                <option value="">Seleccionar</option>
                <option value="contado">Contado</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
              </select>

              {/* Mostrar campo para registrar cheque si el pago es "cheque" */}
              {paymentType === 'cheque' && (
                <>
                  <label>Registrar Cheque:</label>
                  <input
                    type="number"
                    value={chequeInfo}
                    onChange={(e) => setChequeInfo(e.target.value)}
                    placeholder="Ingrese el monto del cheque"
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
    </>
  );
};

export default FacturaProveedores;
