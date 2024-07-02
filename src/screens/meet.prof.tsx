import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  REMOVE_JOB,
  UPDATE_JOB,
  GET_PROFESSIONAL_JOBS
} from '../graphql/jobs.graphql';
import {
  CircularProgress,
  Container,
  Typography,
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ProfMeets: React.FC = () => {
  const theme = useTheme();
  const { loading, error, data, refetch } = useQuery(GET_PROFESSIONAL_JOBS);
  const [removeJob, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_JOB, {
    onCompleted: () => refetch(),
  });
  const [updateJob, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_JOB, {
    onCompleted: () => {
      refetch();
      setEditJob(null);
      setAlertMessage("¡Trabajo actualizado correctamente!");
      setAlertSeverity("success");
    },
    onError: (error) => {
      setAlertMessage(`Error al actualizar el trabajo: ${error.message}`);
      setAlertSeverity("error");
    },
  });

  const [editJob, setEditJob] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "info" | "warning" | undefined>(undefined);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error" sx={{ mt: 2 }}>Error: {error.message}</Alert>
        </Box>
      </Container>
    );
  }

  const handleRemoveJob = (id: number) => {
    
    removeJob({ variables: { id } });
  };

  const handleEditJob = (job: any) => {
    setEditJob(job);
  };

  const handleSaveJob = () => {
    if (editJob) {
      const { id, description, price } = editJob;
      updateJob({
        variables: {
          id, 
          jobName: editJob.jobName,
          description,
          idCategory: editJob.idCategory.id,
          requestsCount: editJob.requestsCount,
          price: parseInt(price, 10) 
        }
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditJob({
      ...editJob,
      [name]: name === 'price' ? parseInt(value, 10) || 0 : value 
    });
  };

  return (
    <Container sx={{ padding: theme.spacing(2) }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: theme.spacing(2) }}>Trabajos del Profesional</Typography>
      {alertMessage && (
        <Alert severity={alertSeverity} sx={{ marginTop: theme.spacing(2) }}>
          {alertMessage}
        </Alert>
      )}
      {data.getProfessionalJobs.message && (
        <Alert severity={data.getProfessionalJobs.success ? "success" : "warning"} sx={{ marginTop: theme.spacing(2) }}>
          {data.getProfessionalJobs.message}
        </Alert>
      )}
      {data.getProfessionalJobs.data.length > 0 ? (
        <Box sx={{ width: '100%' }}>
          {data.getProfessionalJobs.data.map((job: any) => (
            <Card key={job.id} sx={{ marginBottom: theme.spacing(2) }}>
              <CardContent>
                <Typography variant="h6">{job.jobName}</Typography>
                <Typography>Descripción: {job.description}</Typography>
                <Typography>Precio: {job.price}</Typography>
                <Typography>Categoría: {job.idCategory.categoryName}</Typography>
                <Typography>Trabajador: {job.idProfessional.username} ({job.idProfessional.email})</Typography>
                <Box sx={{ marginTop: theme.spacing(2) }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveJob(job.id)}
                    disabled={removeLoading}
                  >
                    {removeLoading ? <CircularProgress size={24} /> : 'Eliminar Trabajo'}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: theme.spacing(2) }}
                    onClick={() => handleEditJob(job)}
                  >
                    Editar Trabajo
                  </Button>
                </Box>
                {removeError && <Alert severity="error" sx={{ mt: 2 }}>{removeError.message}</Alert>}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="subtitle1">No hay trabajos disponibles.</Typography>
      )}
      {editJob && (
        <Box sx={{ marginTop: theme.spacing(4) }}>
          <Typography variant="h5">Editar Trabajo</Typography>
          <TextField
            name="jobName"
            label="Nombre del Trabajo"
            value={editJob.jobName}
            disabled
            fullWidth
            sx={{ marginBottom: theme.spacing(2) }}
          />
          <TextField
            name="description"
            label="Descripción"
            value={editJob.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: theme.spacing(2) }}
          />
          <TextField
            name="price"
            label="Precio"
            type="number" 
            value={editJob.price}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: theme.spacing(2) }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveJob}
            disabled={updateLoading}
          >
            {updateLoading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditJob(null)}
            sx={{ marginLeft: theme.spacing(2) }}
          >
            Cancelar
          </Button>
          {updateError && <Alert severity="error" sx={{ mt: 2 }}>{updateError.message}</Alert>}
        </Box>
      )}
    </Container>
  );
};

export default ProfMeets;