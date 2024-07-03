import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Grid, Paper, Typography, TextField, Button, Snackbar} from "@mui/material";
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
  const [existeCorreo, setExisteCorreo]= useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<RecoverType>>({});

  const [forgotten, { loading, error  }] = useMutation( REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset) {
        setExisteCorreo(data.requestPasswordReset.success);
        if(existeCorreo===true) {
          setAlertMessage("Se ha enviado el correo de recuperación");
        } else {
          setAlertMessage(data.requestPasswordReset.message);
        }
      } else {
        setAlertMessage("Error al enviar el datos");
      }
      setAlertOpen(true);
    }
  });
  
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

    forgotten({ variables: { email: recoverData.email }});

    if (Object.values(newErrors).some(error => error !== "") || !existeCorreo) {
      return;
    }

    navigate("/recover");
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={alertMessage}
        action={
          <Button color="inherit" size="small" onClick={handleAlertClose}>
            Cerrar
          </Button>
        }
      />
    </Container>
  );
};

