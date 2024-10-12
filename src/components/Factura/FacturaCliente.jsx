import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css';
import { FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal'; // Importar react-modal

const FacturaClientes = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [selectedFacturas, setSelectedFacturas] = useState([]); // Facturas seleccionadas para pago
  const [paymentType, setPaymentType] = useState(''); // Tipo de pago seleccionado
  const [cheques, setCheques] = useState([]); // Cheques seleccionados o cargados
  const [selectedCheque, setSelectedCheque] = useState(null); // Cheque seleccionado para el pago
  const [monto, setMonto] = useState(''); // Monto a ingresar para pago parcial
  const [montoPagoTotal, setMontoPagoTotal] = useState(false); // Estado para controlar si es "pago total"
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Mostrar formulario de pago
  const [showChequeModal, setShowChequeModal] = useState(false); // Mostrar modal de cheque
  const [newCheque, setNewCheque] = useState({ numero: '', banco: '', fechaCobro: '', propietario: '', monto: '' }); // Datos del cheque nuevo
  const [payments, setPayments] = useState([]); // Historial de pagos
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el ID del cliente desde la URL

  // Configura react-modal
  Modal.setAppElement('#root'); // Asegúrate de que el 'root' es el elemento correcto en tu DOM

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
          throw new Error('Error al obtener las facturas de clientes');
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

  const handleAddCheque = async () => {
    const chequeData = {
      ...newCheque,
      fechaEmision: new Date().toISOString(),
      propietario: newCheque.propietario,
      fechaCobro: newCheque.fechaCobro,
      numero: newCheque.numero,
      banco: newCheque.banco,
      monto: parseFloat(newCheque.monto),
      idCliente: parseInt(id, 10)
    };

    try {
      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/cheque', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chequeData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el cheque');
      }

      const savedCheque = await response.json();
      setCheques([...cheques, savedCheque]); // Agrega el nuevo cheque al listado de cheques
      setNewCheque({ numero: '', banco: '', fechaCobro: '', propietario: '', monto: '' }); // Limpiar el formulario
      setShowChequeModal(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al crear el cheque:', error);
    }
  };

  const handlePaymentSubmit = async () => {
    const totalFacturas = calcularMontoTotalFacturas();

    try {

      const selectedChequeNumero = selectedCheque
      ? cheques.find(cheque => cheque.numeroCheque === selectedCheque)?.numero
      : null;
    


      const paymentData = {
        idCliente: parseInt(id, 10), // Asegurarse de que sea un número entero
        idFacturas: selectedFacturas.map(factura => parseInt(factura, 10)), // Convertir cada elemento a un número entero
        monto: montoPagoTotal ? parseFloat(totalFacturas) : parseFloat(monto), // Convertir a punto flotante
        metodoPago: paymentType === 'contado' ? 1 : paymentType === 'transferencia' ? 2 : 3, // Valor del método de pago
        idCheques: selectedChequeNumero ? [parseInt(selectedChequeNumero, 10)] : [], // Convertir el cheque seleccionado a un entero y colocarlo en un arreglo si aplica
        idnotasCredito: [], // Arreglo vacío para notas de crédito
    };

      console.log(paymentData)

      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/pagosclientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Añadir 'Accept' para imitar Postman

        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el pago');
      }

      setFacturas((prevFacturas) =>
        prevFacturas.map((factura) =>
          selectedFacturas.includes(factura.id) ? { ...factura, estado: 'pagada' } : factura
        )
      );

      setMonto(''); // Limpiar el campo de monto
      setCheques([]); // Limpiar los cheques
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
          <h1 className="title">Facturas de Clientes</h1>

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
                    <td colSpan="8" className="td">No se encontraron facturas de clientes.</td>
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

              {/* Mostrar opción para agregar cheques si el pago es "cheque" */}
              {paymentType === 'cheque' && (
                <>
                  <button className="btn-add-cheque" onClick={() => setShowChequeModal(true)}>
                    Cargar Cheque
                  </button>

                  {/* Mostrar lista de cheques cargados y opción para seleccionar uno */}
                  {cheques.length > 0 && (
                    <div className="cheques-list">
                      <h4>Cheques Cargados:</h4>
                      <select
                        value={selectedCheque || ''}
                        onChange={(e) => setSelectedCheque(e.target.value)}
                      >
                        <option value="">Seleccionar cheque</option>
                        {cheques.map((cheque) => (
                          <option key={cheque.id} value={cheque.id}>
                            {`Número: ${cheque.numeroCheque}, Banco: ${cheque.banco}, Monto: ${cheque.monto}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <button className="btn-submit" onClick={handlePaymentSubmit}>
                Confirmar Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para cargar cheques */}
      <Modal isOpen={showChequeModal} onRequestClose={() => setShowChequeModal(false)} className="modal-cheque">
        <h3>Cargar Cheque</h3>
        <label>Número de Cheque:</label>
        <input
          type="text"
          value={newCheque.numero}
          onChange={(e) => setNewCheque({ ...newCheque, numero: e.target.value })}
          placeholder="Ingrese el número del cheque"
        />
        <label>Banco:</label>
        <input
          type="text"
          value={newCheque.banco}
          onChange={(e) => setNewCheque({ ...newCheque, banco: e.target.value })}
          placeholder="Ingrese el banco"
        />
        <label>Fecha de Cobro:</label>
        <input
          type="date"
          value={newCheque.fechaCobro}
          onChange={(e) => setNewCheque({ ...newCheque, fechaCobro: e.target.value })}
        />
        <label>Propietario (a nombre de):</label>
        <input
          type="text"
          value={newCheque.propietario}
          onChange={(e) => setNewCheque({ ...newCheque, propietario: e.target.value })}
          placeholder="Ingrese el nombre del propietario"
        />
        <label>Monto:</label>
        <input
          type="number"
          value={newCheque.monto}
          onChange={(e) => setNewCheque({ ...newCheque, monto: e.target.value })}
          placeholder="Ingrese el monto del cheque"
        />
        <button className="btn-submit" onClick={handleAddCheque}>Agregar Cheque</button>
        <button className="btn-close" onClick={() => setShowChequeModal(false)}>Cerrar</button>
      </Modal>

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

export default FacturaClientes;
