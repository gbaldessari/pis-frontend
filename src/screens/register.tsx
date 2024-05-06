import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Box, Typography, TextField, Button } from "@mui/material";

type RegisterType = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export const RegisterPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterType>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterType>>({});

  const dataRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors: Partial<RegisterType> = {};

    Object.entries(registerData).forEach(([key, value]) => {
      if (value.trim() === "") {
        newErrors[key as keyof RegisterType] = `${key} no puede estar vacío`;
      }
    });

    if (registerData.name.length < 2 || registerData.name.length > 64) {
      newErrors.name = "El nombre debe tener entre 2 y 64 caracteres";
    }

    if (registerData.password.length < 8 || registerData.password.length > 16) {
      newErrors.password = "La contraseña debe tener entre 8 y 16 caracteres";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(registerData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    const phonePattern = /^\d{9}$/;
    if (!phonePattern.test(registerData.phone)) {
      newErrors.phone = "Número de teléfono inválido";
    }

    if (registerData.address.length < 2 || registerData.address.length > 64) {
      newErrors.address = "La dirección debe tener entre 2 y 64 caracteres";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            <Typography sx={{ mt: 1.5, mb: 1.5 }} variant="h4">
              Registro
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                name="name"
                margin="normal"
                type="text"
                fullWidth
                label="Nombre"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.name}
                helperText={errors.name}
                onChange={dataRegister}
                value={registerData.name}
              />
              <TextField
                name="email"
                margin="normal"
                type="email"
                fullWidth
                label="Correo Electrónico"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.email}
                helperText={errors.email}
                onChange={dataRegister}
                value={registerData.email}
              />
              <TextField
                name="password"
                margin="normal"
                type="password"
                fullWidth
                label="Contraseña"
                sx={{ mt: 1.5, mb: 1.5 }}
                required
                error={!!errors.password}
                helperText={errors.password}
                onChange={dataRegister}
                value={registerData.password}
              />
              <TextField
                name="phone"
                margin="normal"
                type="text"
                fullWidth
                label="Número Telefónico"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.phone}
                helperText={errors.phone}
                onChange={dataRegister}
                value={registerData.phone}
              />
              <TextField
                name="address"
                margin="normal"
                type="text"
                fullWidth
                label="Dirección"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.address}
                helperText={errors.address}
                onChange={dataRegister}
                value={registerData.address}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5, mb: 3 }}
              >
                Registrarse
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
