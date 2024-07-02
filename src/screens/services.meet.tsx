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

interface Service {
  id: number;
  jobName: string;
  price: number;
  idProfessional: {
    username: string;
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
    startTime: '',
    endTime: '',
  });

  const [showEditFields, setShowEditFields] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
              {showEditFields && (
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
                  <TextField
                    type="time"
                    name="startTime"
                    label="Hora de inicio"
                    value={meetDetails.startTime}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    style={{ marginBottom: 10 }}
                  />
                  <TextField
                    type="time"
                    name="endTime"
                    label="Hora de fin"
                    value={meetDetails.endTime}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                    style={{ marginBottom: 10 }}
                  />
                </>
              )}
              <StarRating stars={service.averageRate} />
            </CardContent>
          </CardActionArea>
          <CardActions>
            {showEditFields ? (
              <>
                <Button fullWidth onClick={() => createMeet({ variables: meetDetails })}>
                  Crear Encuentro
                </Button>
                <Button fullWidth onClick={() => setShowEditFields(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button fullWidth onClick={() => setShowEditFields(true)}>
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