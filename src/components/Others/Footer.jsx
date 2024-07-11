// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">Herrajes Almada &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
