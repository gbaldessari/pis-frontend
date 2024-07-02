import React from "react";
import { useQuery } from "@apollo/client";
import { GET_FIVE_FAVORITE_JOBS } from "../graphql/users.graphql";
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
  const { loading, error, data } = useQuery<{ fiveFavoritesJobs: { data: Job[] } }>(GET_FIVE_FAVORITE_JOBS);
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { fiveFavoritesJobs } = data || {};

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
    </Container>
  );
};

export default FiveFavoriteJobs;