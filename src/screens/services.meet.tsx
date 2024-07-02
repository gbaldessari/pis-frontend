import React, { useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { CREATE_MEET } from '../graphql/meets.graphql';
import { GET_REVIEWS_BY_JOB, GET_JOBS } from '../graphql/jobs.graphql';
import { GET_AVAILABLE_TIMES } from '../graphql/users.graphql';

interface Service {
  id: number;
  jobName: string;
  price: number;
  idProfessional: {
    username: string;
    id: number;
  };
  averageRate: number;
  description: string;
}

interface Review {
  id: number;
  comment: string;
  rate: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  return (
    <div>
      {[...Array(stars)].map((_, index) => (
        <StarIcon key={index} style={{ width: 20, height: 20, color: 'gold' }} />
      ))}
      {[...Array(5 - stars)].map((_, index) => (
        <StarBorderIcon key={index} style={{ width: 20, height: 20 }} />
      ))}
    </div>
  );
};

const ReviewsByJob: React.FC<{ jobId: number }> = ({ jobId }) => {
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [getReviewsByJob, { loading: queryLoading, data }] = useLazyQuery(GET_REVIEWS_BY_JOB, {
    onCompleted: (data) => {
      setReviews(data.getReviewsByJob.data);
      setLoadingReviews(false);
    },
    onError: (error) => {
      setError(`Error fetching reviews: ${error.message}`);
      setLoadingReviews(false);
    }
  });

  const handleFetchReviews = () => {
    setLoadingReviews(true);
    getReviewsByJob({ variables: { idJob: jobId } });
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel1-content" id="panel1-header" onClick={handleFetchReviews}>
        <Typography variant="subtitle1">Ver reseñas</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {queryLoading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {data && data.getReviewsByJob.data.length === 0 && <Typography>No hay reseñas disponibles.</Typography>}
        {data && data.getReviewsByJob.data.length > 0 && (
          <List>
            {data.getReviewsByJob.data.map((review: Review) => (
              <ListItem key={review.id}>
                <ListItemText
                  primary={review.comment}
                  secondary={`Calificación: ${review.rate} - Usuario: ${review.user.username}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
  const [meetDetails, setMeetDetails] = useState({
    idJob: 0,
    meetDate: '',
    selectedTime: '',
  });
  const handleCreateMeet = () => {
    const startTimeParts = meetDetails.selectedTime.split(':');
    const startHour = parseInt(startTimeParts[0]);
    const startMinute = parseInt(startTimeParts[1]);
    const startSecond = parseInt(startTimeParts[2] || '00'); // Assume seconds as '00' if not provided

    const endMinute = startMinute + 45;
    const endHour = startHour + Math.floor(endMinute / 60);
    const formattedEndMinute = endMinute % 60;

    const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${formattedEndMinute.toString().padStart(2, '0')}:${startSecond.toString().padStart(2, '0')}`;

    createMeet({
      variables: {
        idJob: meetDetails.idJob,
        meetDate: meetDetails.meetDate,
        startTime: meetDetails.selectedTime,
        endTime: formattedEndTime,
      },
    });
  };

  const [showEditFields, setShowEditFields] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availableTimesAlert, setAvailableTimesAlert] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMeetDetails({
      ...meetDetails,
      [name]: value,
    });
  };

  const [createMeet] = useMutation(CREATE_MEET, {
    onCompleted: (data) => {
      if (data.createMeet.success) {
        setAlertMessage('¡Encuentro creado con éxito!');
        console.log('Encuentro creado con éxito:', data.createMeet.data);
      } else {
        setAlertMessage(`Error al crear el encuentro: ${data.createMeet.message}`);
        console.error('Error al crear el encuentro:', data.createMeet.message);
      }
    },
    onError: (error) => {
      setAlertMessage(`Error en la mutación CREATE_MEET: ${error.message}`);
      console.error('Error en la mutación CREATE_MEET:', error);
    },
  });

  const [getAvailableTimes, { loading: loadingAvailableTimes }] = useLazyQuery(GET_AVAILABLE_TIMES, {
    onCompleted: (data) => {
      setAvailableTimes(data.getAvailableTimes.data);
      if (data.getAvailableTimes.data.length === 0) {
        setAvailableTimesAlert('No hay horarios disponibles para la fecha seleccionada.');
      } else {
        setAvailableTimesAlert('Horarios disponibles cargados exitosamente.');
      }
    },
    onError: (error) => {
      setAvailableTimesAlert(`Error al obtener los horarios disponibles: ${error.message}`);
      console.error('Error al obtener los horarios disponibles:', error);
    },
  });

  const handleLoadAvailableTimes = (idProfessional: number) => {
    if (meetDetails.meetDate) {
      console.log('Cargando horarios disponibles con:', { idProfessional, date: meetDetails.meetDate });
      getAvailableTimes({ variables: { idProfessional, date: meetDetails.meetDate } });
    }
  };

  const handleSelectTime = (time: string) => {
    setMeetDetails({
      ...meetDetails,
      selectedTime: time,
    });
  };

  return (
    <div>
      {services.map((service) => (
        <Card key={service.id} style={{ marginBottom: 10 }}>
          <CardActionArea>
            <CardContent>
              <Typography variant="h5" component="h2">
                {service.jobName}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Precio: {service.price}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Descripción: {service.description}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Profesional: {service.idProfessional.username}
              </Typography>
              {showEditFields && meetDetails.idJob === service.id && (
                <>
                  <TextField
                    type="date"
                    name="meetDate"
                    label="Fecha de encuentro"
                    value={meetDetails.meetDate}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginBottom: 10 }}
                  />
                  <Button variant="outlined" onClick={() => handleLoadAvailableTimes(service.idProfessional.id)} disabled={!meetDetails.meetDate}>
                    Cargar Horarios Disponibles
                  </Button>
                  {loadingAvailableTimes && <CircularProgress size={24} style={{ marginLeft: 15 }} />}
                  {availableTimesAlert && <Alert severity={availableTimes.length === 0 ? 'error' : 'success'}>{availableTimesAlert}</Alert>}
                  {availableTimes.length > 0 && (
                    <div>
                      <Typography variant="body1" color="textSecondary" style={{ marginTop: 10 }}>Selecciona un horario:</Typography>
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outlined"
                          onClick={() => handleSelectTime(time)}
                          style={{ margin: '5px' }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <StarRating stars={service.averageRate} />
            </CardContent>
          </CardActionArea>
          <CardActions>
            {showEditFields && meetDetails.idJob === service.id ? (
              <>
                {meetDetails.selectedTime && (
                  <Button fullWidth onClick={handleCreateMeet}>
                    Crear Encuentro
                  </Button>
                )}
                <Button fullWidth onClick={() => setShowEditFields(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button fullWidth onClick={() => {
                setMeetDetails({ ...meetDetails, idJob: service.id });
                setShowEditFields(true);
              }}>
                Agregar Encuentro
              </Button>
            )}
            <ReviewsByJob jobId={service.id} />
          </CardActions>
          {alertMessage && (
            <Alert severity={alertMessage.includes('Error') ? 'error' : 'success'} sx={{ marginTop: 2 }}>
              {alertMessage}
            </Alert>
          )}
        </Card>
      ))}
    </div>
  );
};

export const ServicesExample: React.FC = () => {
  const { data, loading, error } = useQuery(GET_JOBS);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{`Error: ${error.message}`}</Alert>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Lista de Servicios
      </Typography>
      <ServiceList services={data.jobs} />
    </Container>
  );
};

export default ServicesExample;