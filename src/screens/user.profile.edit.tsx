import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, EDIT_USER } from '../graphql/users.graphql';
import { CircularProgress, Alert, Button, Container, Typography, TextField, FormControlLabel, Switch, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USER);
  const [editUser] = useMutation(EDIT_USER);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    isProfessional: false
  });

  React.useEffect(() => {
    if (data) {
      setFormData({
        username: data.user.data.username,
        email: data.user.data.email,
        phone: data.user.data.phone,
        address: data.user.data.address,
        isProfessional: data.user.data.isProfessional 
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await editUser({ variables: { ...formData, phone: parseInt(formData.phone) } });
      if (data.editUser.success) {
        alert('Se han guardado los cambios');
        navigate('/profile');
      } else {
        alert('Error al hacer los cambios');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Box sx={{ ml: 11 }}> 
      <Container>
        <Typography variant="h4" gutterBottom>Editar Usuario</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isProfessional}
                onChange={handleChange}
                name="isProfessional"
              />
            }
            label="Professional"
          />
          <Button variant="contained" color="primary" type="submit">Save</Button>
        </form>
      </Container>
    </Box>
  );
};

export default EditProfile;