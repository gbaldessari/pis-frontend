import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, TextField, Button } from "@mui/material";
import { RESET_PASSWORD } from "../graphql/users.graphql"; 
import { useMutation } from "@apollo/client";

type ResetPasswordType = {
    email: string;
    recoveryCode: string;
    newPassword: string;
  };

export const ResetPasswordPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [resetData, setResetData] = useState<ResetPasswordType>({
    email: "",
    recoveryCode: "",
    newPassword: ""
  });

  const [errors, setErrors] = useState<Partial<ResetPasswordType>>({});

  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);
  if (loading) return <p>Enviando...</p>;
  if (error) return <p>Error al enviar! {error.message}</p>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResetData({ ...resetData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Partial<ResetPasswordType> = {};

    if (resetData.recoveryCode.trim().length === 0) {
      newErrors.recoveryCode = "El código de recuperación es obligatorio";
    }

    if (resetData.newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!resetData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) {
        newErrors.email = "Correo electrónico inválido";
      }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    resetPassword({ variables: { 
        email: resetData.email,
        resetPasswordToken: resetData.recoveryCode, 
        password: resetData.newPassword 
    }});

    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            <Typography sx={{ mt: 1.5, mb: 1.5 }} variant="h4">
              Restablecer Contraseña
            </Typography>
            <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
                value={resetData.email}
              />
              <TextField
                name="recoveryCode"
                margin="normal"
                type="text"
                fullWidth
                label="Código de Recuperación"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.recoveryCode}
                helperText={errors.recoveryCode}
                onChange={handleChange}
                value={resetData.recoveryCode}
              />
              <TextField
                name="newPassword"
                margin="normal"
                type="password"
                fullWidth
                label="Nueva Contraseña"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                onChange={handleChange}
                value={resetData.newPassword}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5 }}
              >
                Restablecer Contraseña
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};