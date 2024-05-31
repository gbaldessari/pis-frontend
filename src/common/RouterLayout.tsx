import React from "react";
import { NavBar } from "./NavBar";
import { Outlet } from "react-router-dom";
import { Chat } from "./chat";
export const RouterLayout: React.FC <{}> = ()=>{
 return (
    <>
    <NavBar />
    <Outlet />
    <Chat />
    </>
 )
}
