import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_JOB } from "../graphql/jobs.graphql";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
} from "@mui/material";

type JobInput = {
  jobName: string;
  description: string;
  idCategory: number;
  price: number;
};

const CreateJobForm: React.FC = () => {
  const [jobData, setJobData] = useState<JobInput>({
    jobName: "",
    description: "",
    idCategory: 0,
    price: 0,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [createJob, { loading }] = useMutation(CREATE_JOB, {
    onCompleted: (data) => {
      if (data.createJob.success) {
        setAlertMessage("Se ha creado el trabajo exitosamente");
      } else {
        setAlertMessage("Error, no se ha podido crear un trabajo");
      }
      setAlertOpen(true);
      setJobData({
        jobName: "",
        description: "",
        idCategory: 0,
        price: 0,
      });
    },
    onError: (error) => {
      console.error("Error creando trabajo: ", error);
      setAlertMessage("Error creando trabajo");
      setAlertOpen(true);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: name === "idCategory" || name === "price" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        variables: {
          jobName: jobData.jobName,
          description: jobData.description,
          idCategory: jobData.idCategory,
          price: jobData.price
        },
      });
    } catch (error) {
      console.error("Error creating job: ", error);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Crear Trabajo</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="jobName"
                label="Nombre del Servicio"
                value={jobData.jobName}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="description"
                label="Descripción"
                value={jobData.description}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="idCategory"
                label="ID Categoria"
                type="number"
                value={jobData.idCategory}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="price"
                label="Precio"
                type="number"
                value={jobData.price}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Submitting..." : "Crear Trabajo"}
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

export default CreateJobForm;