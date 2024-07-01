import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_REVIEWS } from '../graphql/jobs.graphql';
import { CircularProgress, Container, Typography, Alert, Grid, Paper } from '@mui/material';

interface Review {
  id: number;
  comment: string;
  rate: number;
  idJob: {
    id: number;
    jobName: string;
  };
  idUser: {
    id: number;
    username: string;
    email: string;
  };
}

const ViewReviews: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_REVIEWS);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const reviews: Review[] = data.getUserReviews.data;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Reseñas</Typography>
      <Grid container spacing={2}>
        {reviews.map((review: Review) => (
          <Grid item xs={12} key={review.id}>
            <Paper style={{ padding: '16px' }}>
              <Typography variant="h6">Usuario: {review.idUser.username}</Typography>
              <Typography>Comentario: {review.comment}</Typography>
              <Typography>Calificación: {review.rate}</Typography>
              <Typography>Trabajo: {review.idJob.jobName}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewReviews;