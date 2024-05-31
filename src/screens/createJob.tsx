import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_JOB} from "../graphql/jobs.graphql";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../AuthContext";
import { GET_USER_BY_EMAIL,EDIT_USER } from "../graphql/users.graphql";

type UserType = {
    id: number;
    username: string;
    email: string;
    password?: string;
    phone: number;
    address: string;
    isProfessional: boolean;
};

type JobInput = {
  jobName: string;
  description: string;
  idCategory: number;
  idProfessional: number;
};

const CreateJobForm: React.FC = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState<JobInput>({
    jobName: "",
    description: "",
    idCategory: 0,
    idProfessional: 0,
  });
  const [userData, setUserData] = useState<UserType | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [getUserByEmail] = useLazyQuery(GET_USER_BY_EMAIL, {
    onCompleted: (data) => {
      if (data.userByEmail.success) {
        setUserData(data.userByEmail.data);
      }
    },
    onError: (error) => {
      console.error("Error fetching user data: ", error);
      setAlertMessage("Error fetching user data");
      setAlertOpen(true);
    }
  });

  const [editUser] = useMutation(EDIT_USER, {
    onError: (error) => {
      console.error("Error editing user: ", error);
      setAlertMessage("Error updating user data");
      setAlertOpen(true);
    }
  });

  const [createJob, { loading }] = useMutation(CREATE_JOB, {
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
        idProfessional: 0,
      });
    },
    onError: (error) => {
      console.error("Error creating job: ", error);
      setAlertMessage("Error creando trabajo");
      setAlertOpen(true);
    }
  });

  useEffect(() => {
    if (user && user.email) {
      getUserByEmail({ variables: { email: user.email } });
    }
  }, [user, getUserByEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: name === "idCategory" || name === "idProfessional" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData && !userData.isProfessional) {
      try {
        await editUser({
          variables: {
            email: userData.email,
            username: userData.username,
            phone: userData.phone,
            address: userData.address,
            isProfessional: true,
          }
        });
      } catch (error) {
        console.error("Error updating user to professional: ", error);
        return;
      }
    }
    try {
      await createJob({
        variables: {
          ...jobData,
          idProfessional: userData?.id
        },
      });
    } catch (error) {
      console.error("Error creating job: ", error);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
        <Grid item>
          <Paper sx={{ padding: "1.2em", borderRadius: "0.5em" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Crear Trabajo</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="jobName"
                label="Job Name"
                value={jobData.jobName}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="description"
                label="Description"
                value={jobData.description}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="idCategory"
                label="Category ID"
                type="number"
                value={jobData.idCategory}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="idProfessional"
                label="Professional ID"
                type="number"
                value={jobData.idProfessional}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Submitting..." : "Create Job"}
              </Button>
            </form>
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