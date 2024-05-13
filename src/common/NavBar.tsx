import React from "react";
import { AppBar, Box, Container, Toolbar, Grid, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export const NavBar: React.FC<{}> = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="xl">
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6" component="div">
                  PapaJobs
                </Typography>
                <img src={Logo} alt="logo" width="100" />
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => navigate("/login")}>Login</Button>
                  <Button variant="contained" onClick={() => navigate("/register")}>Register</Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
