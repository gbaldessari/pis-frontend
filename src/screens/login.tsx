import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Button 
} from "@mui/material";
import { LOGIN_USER } from "../graphql/users.graphql";
import { useMutation } from "@apollo/client";


type LoginType = {
  email: string;
  password: string;
};

export const LoginPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginType>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginType>>({});
  
  const [login, {loading, error}] = useMutation(LOGIN_USER);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  const dataLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Partial<LoginType> = {};

    if (loginData.password.length < 8 || loginData.password.length > 16) {
      newErrors.password = "La contraseña debe tener entre 8 y 16 caracteres";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(loginData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    console.log (loginData);

    login({ variables: {
      email: loginData.email,
      password: loginData.password
    }});
    
    navigate("/home");
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
              Login
            </Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
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
                sx={{ mt: 1.5, mb: 1 }}
              >
                Iniciar Sesión
              </Button>
            </form>
            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1 }}
              onClick={() => navigate("/forgotten")}
            >
              ¿Olvidó su contraseña?
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
