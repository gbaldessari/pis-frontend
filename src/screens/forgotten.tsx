import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Grid, Paper, Typography, TextField, Button} from "@mui/material";
import { REQUEST_PASSWORD_RESET } from "../graphql/users.graphql";
import { useMutation } from "@apollo/client";

type RecoverType = {
  email: string;
};

export const ForgottenPasswordPage: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [recoverData, setRecoverData] = useState<RecoverType>({
    email: ""
  });

  const [errors, setErrors] = useState<Partial<RecoverType>>({});

  const [forgotten, { loading, error }] = useMutation( REQUEST_PASSWORD_RESET);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  const dataRecover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRecoverData({ ...recoverData, [name]: value });
    
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Partial<RecoverType> = {};

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(recoverData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    forgotten({ variables: { email: recoverData.email }});

    navigate("/recover");
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
              Recuperar Contraseña
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
                onChange={dataRecover}
                value={recoverData.email}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1.5 }}
              >
                Enviar Correo de Recuperacion
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

