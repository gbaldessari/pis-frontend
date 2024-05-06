import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

type LoginType = {
  email: string;
  password: string;
};

export const LoginPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = React.useState<LoginType>({
    email: "",
    password: "",
  });

  // Estado para almacenar los mensajes de error
  const [errors, setErrors] = React.useState<Partial<LoginType>>({});

  const dataLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
    // Limpiar el error cuando el usuario comience a escribir en un campo
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evitar el envío automático del formulario

    const newErrors: Partial<LoginType> = {};

    // Validar la contraseña
    if (loginData.password.length < 8 || loginData.password.length > 16) {
      newErrors.password = "La contraseña debe tener entre 8 y 16 caracteres";
    }

    // Validar el correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(loginData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    // Aquí puedes agregar la lógica para autenticar al usuario
    // Por ahora, simplemente redirigimos al usuario a otra página
    navigate("/users");
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
              Login{" "}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                name="email"
                margin="normal"
                type="text"
                fullWidth
                label="Correo Electronico"
                sx={{ mt: 2, mb: 1.5 }}
                required
                error={!!errors.email}
                helperText={errors.email}
                onChange={dataLogin}
                value={loginData.email}
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
                onChange={dataLogin}
                value={loginData.password}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5, mb: 3 }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
