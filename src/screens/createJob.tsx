import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_JOB, GET_CATEGORIES, CREATE_CATEGORY } from "../graphql/jobs.graphql";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
} from "@mui/material";

type Category = {
  id: number;
  categoryName: string;
};

type JobInput = {
  jobName: string;
  description: string;
  idCategory: number;
  price: number;
};

const CreateJobForm: React.FC = () => {
  const [jobData, setJobData] = useState<JobInput>({
    jobName: "",
    description: "",
    idCategory: 0,
    price: 0,
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showCreateJob, setShowCreateJob] = useState(true);

  const { loading, error, data: categoriesData, refetch } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES
  );

  const [createJobMutation] = useMutation(CREATE_JOB, {
    onCompleted: (data) => {
      if (data.createJob.success) {
        setAlertMessage("Se ha creado el trabajo exitosamente");
      } else {
        setAlertMessage("Error, no se ha podido crear un trabajo");
      }
      setAlertOpen(true);
      setJobData({
        jobName: "",
        description: "",
        idCategory: 0,
        price: 0,
      });
    },
    onError: (error) => {
      console.error("Error creando trabajo: ", error);
      setAlertMessage("Error creando trabajo");
      setAlertOpen(true);
    },
  });

  const [createCategoryMutation] = useMutation(CREATE_CATEGORY, {
    onCompleted: (data) => {
      if (data.createCategory.success) {
        setAlertMessage("Categoría creada exitosamente");
        refetch(); 
      } else {
        setAlertMessage("Error al crear la categoría");
      }
      setAlertOpen(true);
      setNewCategoryName("");
    },
    onError: (error) => {
      console.error("Error creando categoría: ", error);
      setAlertMessage("Error creando categoría");
      setAlertOpen(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: name === "idCategory" || name === "price" ? parseInt(value) : value,
    });
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJobMutation({
        variables: {
          jobName: jobData.jobName,
          description: jobData.description,
          idCategory: jobData.idCategory,
          price: parseFloat(jobData.price.toString()), // Convertir a float si es necesario
        },
      });
    } catch (error) {
      console.error("Error creating job: ", error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategoryMutation({
        variables: {
          name: newCategoryName,
        },
      });
    } catch (error) {
      console.error("Error creating category: ", error);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container maxWidth="sm">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            {showCreateJob ? (
              <>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Crear Trabajo
                </Typography>
                <form onSubmit={handleSubmitJob}>
                  <TextField
                    name="jobName"
                    label="Nombre del Servicio"
                    value={jobData.jobName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    name="description"
                    label="Descripción"
                    value={jobData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    name="idCategory"
                    label="ID Categoría"
                    select
                    value={jobData.idCategory}
                    onChange={handleChange}
                    fullWidth
                    required
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ mb: 2 }}
                  >
                    {categoriesData?.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    name="price"
                    label="Precio"
                    type="number"
                    value={jobData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Crear Trabajo"}
                  </Button>
                </form>
                <Button
                  variant="text"
                  onClick={() => setShowCreateJob(false)}
                  sx={{ mt: 2 }}
                >
                  Crear Categoría
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Crear Categoría
                </Typography>
                <form onSubmit={handleCreateCategory}>
                  <TextField
                    name="categoryName"
                    label="Nombre de la Categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Crear Categoría
                  </Button>
                </form>
                <Button
                  variant="text"
                  onClick={() => setShowCreateJob(true)}
                  sx={{ mt: 2 }}
                >
                  Crear Trabajo
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={alertMessage}
        action={
          <Button color="inherit" size="small" onClick={handleAlertClose}>
            Cerrar
          </Button>
        }
      />
    </Container>
  );
};

export default CreateJobForm;