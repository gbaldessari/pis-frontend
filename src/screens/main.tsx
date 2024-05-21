import { Container } from "@mui/material";
import React from "react";
import "./css/Styles.css";
import { Chat } from "../common/chat";

export const MainPage: React.FC<{}> = () => {
    return (
        <Container className="main-page-container" maxWidth="xl">
            PapaJobs
         <Chat/>   
        </Container>
    );
};
