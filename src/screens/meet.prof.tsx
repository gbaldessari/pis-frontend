import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MEETS, FINISH_MEET } from '../graphql/meets.graphql';
import { GET_TOTAL_SALES_GENERATED,GET_TOTAL_SALES_MONTH } from '../graphql/users.graphql';
import { REMOVE_JOB } from '../graphql/jobs.graphql';
import { 
    List, ListItem, Card, CardContent, Typography, CircularProgress, Alert, Container, Box, Button, Grid 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
                                    {removeError && <Alert severity="error" sx={{ mt: 2 }}>{removeError.message}</Alert>}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="subtitle1">No hay reuniones disponibles.</Typography>
            )}
        </Container>
    );
};

export default ProfMeets