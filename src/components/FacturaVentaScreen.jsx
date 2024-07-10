import React, { useState } from 'react';
import Navbar from './Navbar';

const FacturaVentasScreen = () => {
  const [facturas, setFacturas] = useState([
    {
      id: 1,
      sucursal: 'Sucursal 1',
      cliente: 'Cliente A',
      numero: '0001-00001234',
      fecha: '2024-05-24',
      total: 1500,
      tipoFactura: 'A',
      pago: 'Contado',
      detalle: 'Detalle de la factura',
    },
    // Puedes agregar más facturas aquí
  ]);

  const handleCreateFactura = () => {
    // Lógica para crear una nueva factura
    alert('Crear Factura');
  };

  return (
<>
  <Navbar />
    <div className="container">
      <h1 className="title">Factura Ventas</h1>
      <button className="button" onClick={handleCreateFactura}>Crear Factura</button>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Id de la factura</th>
            <th className="th">Sucursal</th>
            <th className="th">Cliente</th>
            <th className="th">Número</th>
            <th className="th">Fecha</th>
            <th className="th">Total</th>
            <th className="th">Tipo Factura</th>
            <th className="th">Pago</th>
            <th className="th">Detalle</th>
            <th className="th">Imprimir</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td className="td">{factura.id}</td>
              <td className="td">{factura.sucursal}</td>
              <td className="td">{factura.cliente}</td>
              <td className="td">{factura.numero}</td>
              <td className="td">{factura.fecha}</td>
              <td className="td">{factura.total}</td>
              <td className="td">{factura.tipoFactura}</td>
              <td className="td">{factura.pago}</td>
              <td className="td">{factura.detalle}</td>
              <td className="td"><button>Imprimir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default FacturaVentasScreen;
