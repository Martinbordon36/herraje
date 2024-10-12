import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
  },
  inputField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  totalsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  totalItem: {
    textAlign: 'center',
  },
}));

const ProductForm = ({
  descuentoGeneral,
  handleDescuentoGeneralChange,
  factura,
  handleChange,
  productos,
  handleCodigoChange,
  handleInputChange,
  agregarProducto,
  eliminarProducto,
  calcularPrecioTotal,
  productOptionsCod,
  productOptionsDes,
  selectedClienteId,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id="descuento-general"
              label="Descuento General (%)"
              type="number"
              value={descuentoGeneral}
              onChange={handleDescuentoGeneralChange}
              className={classes.inputField}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="tipoFactura"
              label="Tipo de Factura"
              select
              value={factura.tipoFactura}
              onChange={handleChange}
              className={classes.inputField}
            >
              <MenuItem value="1">A</MenuItem>
              <MenuItem value="2">N</MenuItem>
              <MenuItem value="3">50 y 50</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {productos.map((producto, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={12} md={4}>
              <Select
                className={classes.inputField}
                value={productOptionsCod.find((option) => option.value === producto.codigo) || ''}
                onChange={(selectedOption) => handleCodigoChange(index, selectedOption)}
                displayEmpty
                disabled={!selectedClienteId}
                fullWidth
              >
                <MenuItem value="">
                  <em>Seleccione un código</em>
                </MenuItem>
                {productOptionsCod.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                className={classes.inputField}
                value={productOptionsDes.find((option) => option.value === producto.codigo) || ''}
                onChange={(selectedOption) => handleCodigoChange(index, selectedOption)}
                displayEmpty
                disabled={!selectedClienteId}
                fullWidth
              >
                <MenuItem value="">
                  <em>Seleccione una descripción</em>
                </MenuItem>
                {productOptionsDes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id={`cantidad-${index}`}
                label="Cantidad"
                type="number"
                value={producto.cantidad}
                onChange={(e) => handleInputChange(index, e)}
                className={classes.inputField}
                inputProps={{ min: 1 }}
                disabled={!selectedClienteId}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id={`precioTotal-${index}`}
                label="Precio Total"
                type="number"
                value={
                  calcularPrecioTotal(index) === null
                    ? 'Completar cantidad por favor'
                    : calcularPrecioTotal(index).toFixed(2)
                }
                className={classes.inputField}
                InputProps={{ readOnly: true }}
                disabled={!selectedClienteId}
              />
            </Grid>
            {producto.removable && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => eliminarProducto(index)}
                style={{ height: '56px' }}
              >
                Eliminar
              </Button>
            )}
          </Grid>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={agregarProducto}
          className={classes.button}
        >
          Agregar Producto
        </Button>

        <div className={classes.totalsContainer}>
          <div className={classes.totalItem}>
            <Typography variant="h6">Gravado:</Typography>
            <Typography variant="body1">${factura.gravado}</Typography>
          </div>
          {factura.tipoFactura === '1' || factura.tipoFactura === '3' ? (
            <div className={classes.totalItem}>
              <Typography variant="h6">IVA (21%):</Typography>
              <Typography variant="body1">${factura.iva}</Typography>
            </div>
          ) : null}
          <div className={classes.totalItem}>
            <Typography variant="h6">Exento:</Typography>
            <Typography variant="body1">${factura.exento}</Typography>
          </div>
          <div className={classes.totalItem}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="body1">${factura.total}</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
