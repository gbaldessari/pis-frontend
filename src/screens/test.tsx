import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_REVIEWS_BY_JOB } from '../graphql/jobs.graphql';
import {
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  TextField,
  Button,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Review {
  id: number;
  comment: string;
  rate: number;
  idJob: number;
  jobName: string;
  categoryName: string;
  username: string;
  email: string;
}

interface ReviewsResponse {
  data: Review[];
  message: string;
  success: boolean;
}

const ReviewsByJob: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<number | null>(null); // Estado para el ID del trabajo

  const [getReviewsByJob, { loading }] = useLazyQuery<ReviewsResponse>(GET_REVIEWS_BY_JOB, {
    onCompleted: (data) => {
      setReviews(data.getReviewsByJob.data);
      setLoadingReviews(false);
      setError(null);
    },
    onError: (error) => {
      setError(`Error fetching reviews: ${error.message}`);
      setLoadingReviews(false);
    },
  });

  const handleFetchReviews = () => {
    if (jobId) {
      setLoadingReviews(true);
      getReviewsByJob({ variables: { idJob: jobId } });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobId(Number(event.target.value));
  };

  return (
    <div>
      <TextField
        label="ID de trabajo"
        type="number"
        value={jobId ?? ''}
        onChange={handleInputChange}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" onClick={handleFetchReviews}>
        Cargar reseñas
      </Button>
      <Accordion style={{ marginTop: '10px' }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography variant="subtitle1">Ver reseñas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loadingReviews && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loadingReviews && reviews.length === 0 && <Typography>No hay reseñas disponibles.</Typography>}
          {!loadingReviews && reviews.length > 0 && (
            <List>
              {reviews.map((review) => (
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
      {!loading && (
        <Typography variant="caption" color="textSecondary" onClick={handleFetchReviews} style={{ cursor: 'pointer' }}>
          Cargar reseñas
        </Typography>
      )}
    </div>
  );
};

export default ReviewsByJob;