import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import toolImage from '../../assets/herraje.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Usuario no encontrado');
      }

      const data = await response.json();
      console.log('INGRESO CORRECTO');
      console.log('Token:', data.token);
      localStorage.setItem('token', data.token);
      navigate('/productos');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/crearusuario');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="p-5 shadow-lg border-0 rounded-lg" style={{ background: 'linear-gradient(135deg, #ffffff, #f0f0f0)' }}>
            <div className="text-center mb-4">
              <img src={toolImage} alt="avatar" className="rounded-circle border border-primary" style={{ width: '120px', height: '120px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
            </div>
            <h3 className="text-center text-primary mb-4" style={{ fontWeight: 'bold', fontSize: '1.75rem' }}>Bienvenido</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-4">
                <Form.Label className="fw-bold">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm"
                  required
                  style={{ borderRadius: '25px', padding: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label className="fw-bold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm"
                  required
                  style={{ borderRadius: '25px', padding: '10px' }}
                />
              </Form.Group>

              {error && <div className="alert alert-danger text-center">{error}</div>}

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={loading} className="shadow-sm fw-bold" style={{ borderRadius: '25px', padding: '10px' }}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Iniciar Sesión'}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <Button variant="link" onClick={handleSignupRedirect} className="shadow-sm fw-bold text-decoration-none" style={{ fontSize: '1rem' }}>
                ¿No tienes cuenta? <span className="text-primary">Crear Usuario</span>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;