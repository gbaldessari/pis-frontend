import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MEETS, FINISH_MEET } from '../graphql/meets.graphql';
import { GET_TOTAL_SALES_GENERATED, GET_TOTAL_SALES_MONTH } from '../graphql/users.graphql';
import { REMOVE_JOB } from '../graphql/jobs.graphql';
import {  Card, CardContent, Typography, CircularProgress, Alert, Container, Box, Button, Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gql } from '@apollo/client';

const ProfMeets: React.FC = () => {
    const theme = useTheme();
    const { loading, error, data, refetch } = useQuery(GET_USER_MEETS);
    const { loading: salesLoading, error: salesError, data: salesData } = useQuery(GET_TOTAL_SALES_GENERATED);
    const { loading: monthSalesLoading, error: monthSalesError, data: monthSalesData } = useQuery(GET_TOTAL_SALES_MONTH);
    const [finishMeet, { loading: mutationLoading }] = useMutation(FINISH_MEET, {
        onCompleted: () => refetch(),
    });
    const [removeJob, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_JOB, {
        onCompleted: () => refetch(),
    });
    const [updateJob, { loading: updateLoading }] = useMutation(UPDATE_JOB, {
        onCompleted: () => refetch(),
    });

    const [editJob, setEditJob] = useState<any>(null);

    if (loading || salesLoading || monthSalesLoading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || salesError || monthSalesError) {
        return (
            <Container>
                <Box mt={4}>
                    <Alert severity="error" sx={{ mt: 2 }}>Error: {error?.message || salesError?.message || monthSalesError?.message}</Alert>
                </Box>
            </Container>
        );
    }

    const handleFinishMeet = (id: string) => {
        finishMeet({ variables: { id } });
    };

    const handleRemoveJob = (id: number) => {
        console.log('Removing Job ID:', id);
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
                    description,
                    price
                }
            });
            setEditJob(null);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditJob({
            ...editJob,
            [name]: value
        });
    };

    const meets = data?.getUserMeets?.data || [];
    const message = data?.getUserMeets?.message || '';

    const totalSales = salesData?.totalSalesGenerated?.data || 0;
    const totalSalesMonth = monthSalesData?.totalSalesMonth?.data || 0;

    return (
        <Container sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: theme.spacing(2) }}>Profesional Meets</Typography>
            {message && (
                <Alert severity={data.getUserMeets.success ? "success" : "warning"} sx={{ marginTop: theme.spacing(2) }}>
                    {message}
                </Alert>
            )}
            <Box sx={{ marginBottom: theme.spacing(2) }}>
                <Typography variant="h6">Ventas Totales: {totalSales}</Typography>
                <Typography variant="h6">Ventas del Mes: {totalSalesMonth}</Typography>
            </Box>
            {meets.length > 0 ? (
                <Grid container spacing={3}>
                    {meets.map((meet: any) => (
                        <Grid item xs={12} sm={6} md={4} key={meet.id}>
                            <Card sx={{ width: '100%', marginBottom: theme.spacing(2) }}>
                                <CardContent>
                                    <Typography variant="h6"> {meet.idJob.jobName}</Typography>
                                    <Typography>Descripción: {meet.idJob.description}</Typography>
                                    <Typography>Estrellas: {meet.idJob.averageRate}</Typography>
                                    <Typography>Categoría: {meet.idJob.idCategory.categoryName}</Typography>
                                    <Typography>Trabajador: {meet.idJob.idProfessional.username} ({meet.idJob.idProfessional.email})</Typography>
                                    <Typography>Fecha Reunión: {meet.meetDate}</Typography>
                                    <Typography>Hora Inicio: {meet.startTime}</Typography>
                                    <Typography>Hora de Término: {meet.endTime}</Typography>
                                    <Typography>Estado: {meet.isDone ? 'Finalizado' : 'En Proceso'}</Typography>
                                    {!meet.isDone && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginTop: theme.spacing(2) }}
                                            onClick={() => handleFinishMeet(meet.id)}
                                            disabled={mutationLoading}
                                        >
                                            {mutationLoading ? <CircularProgress size={24} /> : 'Finalizar Servicio'}
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ marginTop: theme.spacing(2) }}
                                        onClick={() => handleRemoveJob(meet.idJob.id)}
                                        disabled={removeLoading}
                                    >
                                        {removeLoading ? <CircularProgress size={24} /> : 'Eliminar Trabajo'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ marginTop: theme.spacing(2) }}
                                        onClick={() => handleEditJob(meet.idJob)}
                                    >
                                        Editar Trabajo
                                    </Button>
                                    {removeError && <Alert severity="error" sx={{ mt: 2 }}>{removeError.message}</Alert>}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="subtitle1">No hay reuniones disponibles.</Typography>
            )}
            {editJob && (
                <Box sx={{ marginTop: theme.spacing(4) }}>
                    <Typography variant="h5">Editar Trabajo</Typography>
                    <TextField
                        name="jobName"
                        label="Nombre del Trabajo"
                        value={editJob.jobName}
                        onChange={handleInputChange}
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
                        name="idCategory"
                        label="ID Categoría"
                        value={editJob.idCategory}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: theme.spacing(2) }}
                    />
                    <TextField
                        name="requestsCount"
                        label="Cantidad de Solicitudes"
                        value={editJob.requestsCount}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: theme.spacing(2) }}
                    />
                    <TextField
                        name="price"
                        label="Precio"
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
                </Box>
            )}
        </Container>
    );
};

export default ProfMeets;

export const UPDATE_JOB = gql`
  mutation updateJob(
    $id: ID!,
    $description: String,
    $price: Int
  ) {
    updateJob(id: $id, updateJobInput: {
      description: $description,
      price: $price
    }) {
      data
      message
      success
    }
  }
`;