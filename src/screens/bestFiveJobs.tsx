import React from "react";
import { useQuery } from "@apollo/client";
import { GET_FIVE_FAVORITE_JOBS, GET_TOTAL_SALES_GENERATED, GET_TOTAL_SALES_MONTH } from "../graphql/users.graphql";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { StarBorder as StarIcon } from "@mui/icons-material";

type Job = {
  id: number;
  jobName: string;
  description: string;
  averageRate: number;
  idCategory: {
    id: number;
    categoryName: string;
  };
  idProfessional: {
    id: number;
    username: string;
    email: string;
  };
  requestsCount: number;
};

const FiveFavoriteJobs: React.FC = () => {
  const { loading: loadingJobs, error: errorJobs, data: dataJobs } = useQuery<{ fiveFavoritesJobs: { data: Job[] } }>(GET_FIVE_FAVORITE_JOBS);
  const { loading: loadingTotalSalesGenerated, error: errorTotalSalesGenerated, data: dataTotalSalesGenerated } = useQuery(GET_TOTAL_SALES_GENERATED);
  const { loading: loadingTotalSalesMonth, error: errorTotalSalesMonth, data: dataTotalSalesMonth } = useQuery(GET_TOTAL_SALES_MONTH);

  if (loadingJobs || loadingTotalSalesGenerated || loadingTotalSalesMonth) return <p>Loading...</p>;
  if (errorJobs || errorTotalSalesGenerated || errorTotalSalesMonth) return <p>Error</p>;

  const { fiveFavoritesJobs } = dataJobs || {};
  const totalSalesGenerated = dataTotalSalesGenerated?.totalSalesGenerated?.data;
  const totalSalesMonth = dataTotalSalesMonth?.totalSalesMonth?.data;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Top 5 Trabajos Favoritos
      </Typography>
      <Paper elevation={3}>
        <List>
          {fiveFavoritesJobs?.data.map((job) => (
            <ListItem key={job.id}>
              <ListItemText
                primary={job.jobName}
                secondary={`${job.description} - ${job.idProfessional.username}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <StarIcon color="primary" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant="h5" gutterBottom>
        Total Ventas Generadas:$ {totalSalesGenerated}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Total Ventas del Mes:$ {totalSalesMonth}
      </Typography>
    </Container>
  );
};

export default FiveFavoriteJobs;