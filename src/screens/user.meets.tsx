import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MEETS, FINISH_MEET } from '../graphql/meets.graphql';
import { 
    List, ListItem, Card, CardContent, Typography, CircularProgress, Alert, Container, Box, Button, Grid 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const UserMeets: React.FC = () => {
    const theme = useTheme();
    const { loading, error, data, refetch } = useQuery(GET_USER_MEETS);
    const [finishMeet, { loading: mutationLoading }] = useMutation(FINISH_MEET, {
        onCompleted: () => refetch(), 
    });

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

    const handleFinishMeet = (id: string) => {
        finishMeet({ variables: { id } });
    };

    const meets = data?.getUserMeets?.data || [];
    const message = data?.getUserMeets?.message || '';

    return (
        <Container sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: theme.spacing(2) }}>User Meets</Typography>
            {message && (
                <Alert severity={data.getUserMeets.success ? "success" : "warning"} sx={{ marginTop: theme.spacing(2) }}>
                    {message}
                </Alert>
            )}
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

export default UserMeets;
