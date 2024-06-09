import React from 'react';
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
            Ver
          </Button>
        </Card>
      ))}
    </div>
  );
};

const mockServices = [
  {
    id: "1",
    jobName: "Desarrollador Frontend",
    averageRate: 4,
    description: "Desarrollo de interfaces de usuario usando React.js y Redux."
  },
  {
    id: "2",
    jobName: "Desarrollador Backend",
    averageRate: 5,
    description: "Desarrollo de API RESTful con Node.js y Express."
  },
  {
    id: "3",
    jobName: "Diseñador UX/UI",
    averageRate: 3,
    description: "Diseño de experiencias de usuario y interfaces atractivas."
  }
];

export const ServicesExample1: React.FC = () => {
  const services = mockServices;

  return (
    <div>
      <h1>Lista de Servicios</h1>
      <ServiceList services={services} />
    </div>
  );
};

export default ServicesExample1;