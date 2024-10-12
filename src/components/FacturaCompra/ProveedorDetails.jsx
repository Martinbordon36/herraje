import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  avatar: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  label: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  value: {
    color: theme.palette.text.primary,
    marginTop: theme.spacing(0.5),
    fontSize: '1.1rem',
  },
}));

const ProveedorDetails = ({ selectedProveedor, proveedorDetails }) => {
  const classes = useStyles();

//   if (!selectedCliente) return null;

  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" color="textPrimary">
          Detalles del Proveedor
        </Typography>
      </div>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography className={classes.label}>CUIT:</Typography>
            <Typography variant="body1" className={classes.value}>
            {proveedorDetails.cuit}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
          <Typography className={classes.label}>Razón Social:</Typography>
            <Typography variant="body1" className={classes.value}>
            {proveedorDetails.razonSocial}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography className={classes.label}>Domicilio:</Typography>
            <Typography variant="body1" className={classes.value}>
            {proveedorDetails.domicilio}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography className={classes.label}>Condición de Venta:</Typography>
            <Typography variant="body1" className={classes.value}>
            {proveedorDetails.condicionVenta}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
          <Typography className={classes.label}>Condición de IVA:</Typography>
          <Typography variant="body1" className={classes.value}>
            {proveedorDetails.condicionIva}
            </Typography>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProveedorDetails;