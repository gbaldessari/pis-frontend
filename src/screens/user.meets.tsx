import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MEETS, FINISH_MEET } from '../graphql/meets.graphql';
import { 
    List, ListItem, Card, CardContent, Typography, CircularProgress, Alert, Container, Box, Button, Grid, Dialog, DialogTitle, DialogContent 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const UserMeets: React.FC = () => {
    const theme = useTheme();
    const { loading, error, data, refetch } = useQuery(GET_USER_MEETS);
    const [finishMeet, { loading: mutationLoading }] = useMutation(FINISH_MEET, {
        onCompleted: () => refetch(), 
    });

    const [openMap, setOpenMap] = useState(false);
    const [selectedMeet, setSelectedMeet] = useState(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

    const handleMapOpen = (meet: any) => {
        setSelectedMeet(meet);
        setOpenMap(true);
    };

    const handleMapClose = () => {
        setOpenMap(false);
        setSelectedMeet(null);
        setDirections(null);
    };

    function updateDirections(newDirections: google.maps.DirectionsResult | null) {
        setDirections(newDirections);
    }

    const fetchDirections = useCallback((meet: any) => {
        const service = new google.maps.DirectionsService();
        const origin = meet.idJob.idProfessional.address;
        const destination = meet.idUser.address;

        service.route(
            {
                origin,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    updateDirections(result);
                    console.log("Result: ", result);
                    console.log("Status: ", status);
                    console.log("Directions: ", directions);
                } else {
                    console.error(`Error fetching directions: ${status}`);
                }
            }
        );
    }, []);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.async = true;
            script.onload = () => setGoogleMapsLoaded(true);
            document.head.appendChild(script);
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            setGoogleMapsLoaded(true);
        }

        if (selectedMeet && googleMapsLoaded) {
            fetchDirections(selectedMeet);
        }
        
    }, [selectedMeet, googleMapsLoaded, fetchDirections]);

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
        finishMeet({ variables: { idMeet: parseInt(id) } });
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
                                        <Box display="flex" justifyContent="space-between">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ marginTop: theme.spacing(2) }}
                                                onClick={() => handleFinishMeet(meet.id)}
                                                disabled={mutationLoading}
                                            >
                                                {mutationLoading ? <CircularProgress size={24} /> : 'Finalizar Servicio'}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ marginTop: theme.spacing(2) }}
                                                onClick={() => handleMapOpen(meet)}
                                            >
                                                Ver Mapa de Recorrido
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="subtitle1">No hay reuniones disponibles.</Typography>
            )}
            <Dialog open={openMap} onClose={handleMapClose} maxWidth="md" fullWidth>
                <DialogTitle>Mapa de Recorrido</DialogTitle>
                <DialogContent>
                    <LoadScript googleMapsApiKey="AIzaSyCxydBX49WaTyeAs_IllYHh6TPu8mmuj2w">
                        <GoogleMap
                            mapContainerStyle={{ height: '400px', width: '100%' }}
                            zoom={14}
                            center={directions?.routes[0]?.legs[0]?.start_location || { lat: 0, lng: 0 }}
                        >
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </LoadScript>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default UserMeets; 