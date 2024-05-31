import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ThemeConfig } from "../config/theme.config";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <ThemeConfig>
      <div style={{ textAlign: "center" }}>
        <h1>Home</h1>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
        >
          Volver
        </Button>
      </div>
    </ThemeConfig>
  );
};
