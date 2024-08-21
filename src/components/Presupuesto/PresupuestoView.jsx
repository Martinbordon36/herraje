import React from 'react';
import './FacturaView.css';

const PresupuestoView = ({ factura }) => {
  return (
    <div className="factura-container">
      <header className="factura-header">
        <div className="factura-logo">
          <img src="url_to_logo" alt="Logo" />
        </div>
        <div className="factura-info">
          <h1>FACTURA A</h1>
          <p>N°: {factura.numero}</p>
          <p>Fecha de emisión: {factura.fechaEmision}</p>
          <p>CUIT: {factura.cuit}</p>
          <p>Condición frente al IVA: {factura.condicionIva}</p>
        </div>
      </header>
      
      <section className="factura-client-info">
        <div>
          <p><strong>Razón social:</strong> {factura.cliente.razonSocial}</p>
          <p><strong>CUIT:</strong> {factura.cliente.cuit}</p>
          <p><strong>Condición frente al IVA:</strong> {factura.cliente.condicionIva}</p>
          <p><strong>Domicilio:</strong> {factura.cliente.domicilio}</p>
        </div>
      </section>
      
      <section className="factura-table">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto / Servicio</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>% Dto.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {factura.productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.codigo}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.precioUnitario}</td>
                <td>{producto.descuento}</td>
                <td>{producto.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="factura-totales">
        <div className="totales-grid">
          <p><strong>Gravado:</strong> {factura.gravado}</p>
          <p><strong>IVA:</strong> {factura.iva}</p>
          <p><strong>Exento:</strong> {factura.exento}</p>
          <p><strong>Total:</strong> {factura.total}</p>
        </div>
      </section>
      
      <footer className="factura-footer">
        <p>C.A.E.: {factura.cae} Fecha Vto: {factura.fechaVto}</p>
      </footer>
    </div>
  );
};

export default PresupuestoView;
