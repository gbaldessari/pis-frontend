import React from "react";
import { AppBar, Box, Container, Toolbar, Grid, Button, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import MapachePedro from "../assets/mapache-pedro-mapache.gif";
export const NavBar: React.FC<{}> = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="xl">
            <Grid
              container
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item>
                <Typography>Proyecto</Typography>
                <img src={MapachePedro} alt="Mapache Pedro" width="100" />
              </Grid>

              <Grid item>
                <Stack direction="row" spacing={2}>
                <Link to="/login">
                  <Button variant="contained"> Login </Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained"> Register </Button>
                </Link>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
