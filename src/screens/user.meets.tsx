import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_MEETS, GET_PROFESSIONAL_MEETS, FINISH_MEET } from '../graphql/meets.graphql';
import {
    Card, CardContent, Typography, CircularProgress, Alert, Container, Box, Button, Grid, Dialog, DialogTitle, DialogContent, Tabs, Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const MAP_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Reemplaza con tu API key

const UserMeets: React.FC = () => {
    const theme = useTheme();
    const { loading: loadingUserMeets, error: errorUserMeets, data: dataUserMeets, refetch: refetchUserMeets } = useQuery(GET_USER_MEETS);
    const { loading: loadingProfessionalMeets, error: errorProfessionalMeets, data: dataProfessionalMeets, refetch: refetchProfessionalMeets } = useQuery(GET_PROFESSIONAL_MEETS);
    const [finishMeet, { loading: mutationLoading }] = useMutation(FINISH_MEET, {
        onCompleted: () => {
            refetchUserMeets();
            refetchProfessionalMeets();
        },
    });

    const [openMap, setOpenMap] = useState(false);
    const [selectedMeet, setSelectedMeet] = useState<any>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleMapOpen = (meet: any) => {
        setSelectedMeet(meet);
        setOpenMap(true);
    };

    const handleMapClose = () => {
        setOpenMap(false);
        setSelectedMeet(null);
        setDirections(null);
    };

    const updateDirections = useCallback((newDirections: google.maps.DirectionsResult | null) => {
        setDirections(newDirections);
    }, []);

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
                } else {
                    console.error(`Error fetching directions: ${status}`);
                }
            }
        );
    }, [updateDirections]);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&libraries=places&callback=initMap`;
            const alreadyLoaded = document.querySelectorAll(`script[src="${scriptSrc}"]`).length > 0;

            if (!alreadyLoaded) {
                const googleMapScript = document.createElement('script');
                googleMapScript.src = scriptSrc;
                googleMapScript.async = true;
                googleMapScript.onload = () => setGoogleMapsLoaded(true);
                googleMapScript.onerror = () => console.error('Error loading Google Maps script');
                document.head.appendChild(googleMapScript);
            } else {
                setGoogleMapsLoaded(true);
            }
        };

        loadGoogleMapsScript();
    }, []);

    useEffect(() => {
        if (selectedMeet && googleMapsLoaded) {
            fetchDirections(selectedMeet);
        }
    }, [selectedMeet, googleMapsLoaded, fetchDirections]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleFinishMeet = (id: string) => {
        finishMeet({ variables: { idMeet: parseInt(id) } });
    };

    const renderMeets = (meets: any[], message: string, error: any, loading: boolean) => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box mt={4}>
                    <Alert severity="error" sx={{ mt: 2 }}>Error: {error.message}</Alert>
                </Box>
            );
        }

        return (
            <>
                {message && (
                    <Alert severity="success" sx={{ marginTop: theme.spacing(2) }}>
                        {message}
                    </Alert>
                )}
                {meets.length > 0 ? (
                    <Grid container>
                        {meets.map((meet: any) => (
                            <Grid item xs={12} key={meet.id}>
                                <Card sx={{ width: '100%', marginBottom: theme.spacing(2) }}>
                                    <CardContent>
                                        <Typography variant="h6">{meet.idJob.jobName}</Typography>
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
            </>
        );
    };

    return (
        <Container sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: theme.spacing(2) }}>Mis Reuniones</Typography>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Como Usuario" />
                <Tab label="Como Profesional" />
            </Tabs>
            {selectedTab === 0 && renderMeets(dataUserMeets?.getUserMeets?.data || [], dataUserMeets?.getUserMeets?.message || '', errorUserMeets, loadingUserMeets)}
            {selectedTab === 1 && renderMeets(dataProfessionalMeets?.getProfessionalMeets?.data || [], dataProfessionalMeets?.getProfessionalMeets?.message || '', errorProfessionalMeets, loadingProfessionalMeets)}
            <Dialog open={openMap} onClose={handleMapClose} maxWidth="md" fullWidth>
                <DialogTitle>Mapa de Recorrido</DialogTitle>
                <DialogContent>
                    <LoadScript googleMapsApiKey={MAP_API_KEY}>
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