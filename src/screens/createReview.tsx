import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/jobs.graphql';
import { GET_JOBS } from '../graphql/jobs.graphql';
import { TextField, Button, Container, Typography, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const CreateReview: React.FC = () => {
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState<number | undefined>(undefined);
  const [idJob, setIdJob] = useState<number | undefined>(undefined);
  const [createReview, { data: createData, loading: createLoading, error: createError }] = useMutation(CREATE_REVIEW);

  const { loading: jobsLoading, error: jobsError, data: jobsData } = useQuery(GET_JOBS);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Job ID:', idJob);
    if (comment && rate !== undefined && idJob !== undefined) {
      createReview({ variables: { comment, rate, idJob } });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Crear Reseña</Typography>
      {createLoading && <CircularProgress />}
      {createError && <Alert severity="error">{createError.message}</Alert>}
      {createData && createData.createReview && createData.createReview.success && (
        <Alert severity="success">{createData.createReview.message}</Alert>
      )}
      {createData && createData.createReview && !createData.createReview.success && (
        <Alert severity="error">{createData.createReview.message}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Calificación"
          type="number"
          value={rate}
          onChange={(e) => setRate(parseInt(e.target.value))}
          fullWidth
          margin="normal"
        />
        
        {jobsLoading && <CircularProgress />}
        {jobsError && <Alert severity="error">{jobsError.message}</Alert>}
        
        {jobsData && jobsData.jobs && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="job-select-label">Trabajo</InputLabel>
            <Select
              labelId="job-select-label"
              value={idJob || ''}
              onChange={(e) => setIdJob(parseInt(e.target.value as string))}
            >
              {jobsData.jobs.map((job: any) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.jobName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px' }}>
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default CreateReview;