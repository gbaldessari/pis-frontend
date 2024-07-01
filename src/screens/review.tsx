import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../graphql/jobs.graphql';
import { CircularProgress, Container, Typography, Alert, Grid, Paper } from '@mui/material';

const ViewReviews: React.FC = () => {
  const { loading, error, data } = useQuery(GET_REVIEWS);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Reseñas</Typography>
      <Grid container spacing={2}>
        {data.reviews.map((data: any) => (
          <Grid item xs={12} key={data.review.id}>
            <Paper style={{ padding: '16px' }}>
              <Typography variant="h6">Usuario: {data.review.idUser.username}</Typography>
              <Typography>Comentario: {data.review.comment}</Typography>
              <Typography>Calificación: {data.review.rate}</Typography>
              <Typography>Trabajo: {data.review.idJob.jobName}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewReviews;