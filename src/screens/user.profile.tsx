import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../graphql/users.graphql';
import { CircularProgress, Alert, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USER);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom align="center">Perfil de usuario</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Usuario: {data.user.data.username}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Correo: {data.user.data.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Telefono: {data.user.data.phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Dirrecion: {data.user.data.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Profesional: {data.user.data.isProfessional ? 'Yes' : 'No'}</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleEditProfile}>Edit Profile</Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewProfile;