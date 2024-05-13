import React  from "react";
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


  // aqui va a depender como lo se tiene en el back (esto es un ejemplo)
  interface Service {
    id: number;
    name: string;
    description: string;
    estrellas: number;
  }
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
  const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
    return (
      <div>
        {services.map((service) => (
          <Card key={service.id} style={{ marginBottom: 10 }}>
            <CardActionArea>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {service.name}
                </Typography>
                <StarRating stars={service.estrellas} />
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
                  <Typography >Descripcion</Typography>
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
              view
            </Button>
          </Card>
        ))}
      </div>
    );
  };
  
  export const ServicesExample: React.FC = () => {
    const servicesData: Service[] = [
      {
        id: 1,
        name: "Servicio 1",
        description: "Descripción del Servicio 1",
        estrellas: 3,
      },
      {
        id: 2,
        name: "Servicio 2",
        description: "Descripción del Servicio 2",
        estrellas: 5,
      },
    ];
  
    return (
      <div>
        <h1>Lista de Servicios</h1>
        <ServiceList services={servicesData} />
      </div>
    );
  };
  
