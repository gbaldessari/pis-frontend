import React from "react";
import { Link } from "react-router-dom";
import MapachePedro from "../../assets/mapache-pedro-mapache.gif";
import { ThemeConfig } from "../../config/theme.config";
import { Button } from "@mui/material";
export const Users: React.FC = () => {
  return (
    <ThemeConfig>
    <div>
      <h1>PAGINA DE USERS </h1>
      <img src= {MapachePedro} alt= "Mapache Pedro" width={200}/>
      <Link to="/">
        <Button variant="contained">Back</Button>
      </Link>
    </div>
    </ThemeConfig>
  );
};

