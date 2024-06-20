import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_JOBS } from '../graphql/jobs.graphql';
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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  return (
    <div>
      {[...Array(stars)].map((_, index) => (
        <StarIcon
          key={index}
          style={{ width: 20, height: 20, color: "gold" }}
        />
      ))}
      {[...Array(5 - stars)].map((_, index) => (
        <StarBorderIcon key={index} style={{ width: 20, height: 20 }} />
      ))}
    </div>
  );
};

const ServiceList: React.FC<{ services: any[] }> = ({ services }) => {
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
                Precio: {service.price} {/* Mostrar el precio */}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Profesional: {service.idProfessional.username} {/* Mostrar el nombre del profesional */}
              </Typography>
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
                <Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {service.description} 
                  </Typography>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardActions>
          <Button fullWidth>
            Agregar
          </Button>
        </Card>
      ))}
    </div>
  );
};

export const ServicesExample: React.FC = () => {
  const { data, loading, error } = useQuery(GET_JOBS);
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);
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