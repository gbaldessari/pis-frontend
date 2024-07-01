
import React, { useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_JOBS } from '../graphql/jobs.graphql';
import { CREATE_MEET } from '../graphql/meets.graphql';
import { GET_REVIEWS_BY_JOB } from '../graphql/jobs.graphql';
import {
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
  ListItemText
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  idUser: {
    username: string;
  };
}

const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  return (
    <div>
      {[...Array(stars)].map((_, index) => (
        <StarIcon key={index} style={{ width: 20, height: 20, color: "gold" }} />
      ))}
      {[...Array(5 - stars)].map((_, index) => (
        <StarBorderIcon key={index} style={{ width: 20, height: 20 }} />
      ))}
    </div>
  );
};

const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
  const [meetDetails, setMeetDetails] = useState({
    idJob: 0,
    meetDate: "",
    startTime: "",
    endTime: ""
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [showEditFields, setShowEditFields] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMeetDetails({
      ...meetDetails,
      [name]: value
    });
  };

  const [createMeet] = useMutation(CREATE_MEET, {
    onCompleted: (data) => {
      if (data.createMeet.success) {
        console.log("Encuentro creado con éxito:", data.createMeet.data);
      } else {
        console.error("Error al crear el encuentro:", data.createMeet.message);
      }
    },
    onError: (error) => {
      console.error("Error en la mutación CREATE_MEET:", error);
    }
  });

  const [getReviewsByService] = useLazyQuery(GET_REVIEWS_BY_JOB, {
    onCompleted: (data) => {
      setReviews(data.getReviewsByJob.data);
      setLoadingReviews(false);
    },
    onError: (error) => {
      console.error("Error fetching reviews:", error);
      setLoadingReviews(false);
    }
  });

  const handleVerClick = (serviceId: number) => {
    setShowEditFields(true);
    setMeetDetails({
      ...meetDetails,
      idJob: serviceId
    });
    setLoadingReviews(true);
    getReviewsByService({ variables: { idJob: serviceId } });
  };

  const handleSubmit = () => {
    createMeet({
      variables: meetDetails
    });
    setShowEditFields(false);
  };

  const handleCancel = () => {
    setShowEditFields(false);
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
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography>Descripción</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="textSecondary" gutterBottom>
                  {service.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardActions>
          {showEditFields && (
            <>
              <Button fullWidth onClick={handleSubmit}>
                Crear Encuentro
              </Button>
              <Button fullWidth onClick={handleCancel}>
                Cancelar
              </Button>
            </>
          )}
          {!showEditFields && (
            <Button fullWidth onClick={() => handleVerClick(service.id)}>
              Agregar
            </Button>
          )}
          {loadingReviews && <CircularProgress />}
          {!loadingReviews && reviews.length > 0 && (
            <List>
              {reviews.map((review) => (
                <ListItem key={review.id}>
                  <ListItemText
                    primary={review.comment}
                    secondary={`Calificación: ${review.rate} - ${review.idUser.username}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Card>
      ))}
    </div>
  );
};

export const ServicesExample: React.FC = () => {
  const { data, loading, error } = useQuery(GET_JOBS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div>
      <h1>Lista de Servicios</h1>
      <ServiceList services={data.jobs} />
    </div>
  );
};

export default ServicesExample;