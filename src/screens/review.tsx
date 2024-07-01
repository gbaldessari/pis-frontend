import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_REVIEWS } from '../graphql/users.graphql';
import { CircularProgress, Container, Typography, Alert, Grid, Paper } from '@mui/material';

const ViewReviews: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_REVIEWS);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Reseñas</Typography>
      <Grid container spacing={2}>
        {data.getUserReviews.data.map((review: any) => (
          <Grid item xs={12} key={review.id}>
            <Paper style={{ padding: '16px' }}>
              <Typography variant="h6">Usuario: {review.user.username}</Typography>
              <Typography>Comentario: {review.comment}</Typography>
              <Typography>Calificación: {review.rate}</Typography>
              <Typography>Trabajo: {review.job.jobName}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewReviews;