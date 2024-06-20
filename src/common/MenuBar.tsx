import React from 'react';
import { useQuery } from '@apollo/client';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, CssBaseline, CircularProgress, Alert } from '@mui/material';
import { Business, AddBusiness, Logout, Bookmark, Person2, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Cookies from 'js-cookie';
import { GET_USER } from '../graphql/users.graphql';

const drawerWidth = 240;

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  //const { loading, error, data } = useQuery(GET_USER);

  const handleListItemClick = (text: string) => {
    if (text === 'Servicios Disponibles') {
      navigate('/services');
    } else if (text === 'Agregar Servicios') {
      navigate('/create-job');
    } else if (text === 'Logout') {
      logout();
      Cookies.remove('token');
      navigate('/login');
    } else if (text === 'Home') {
      navigate('/home');
    } else if (text === 'Mis Reuniones') {
      navigate('/userMeets');
    } else if (text === 'Perfil') {
      navigate('/profile');
    }
  };

  //if (loading) return <CircularProgress />;
  //if (error) return <Alert severity="error"> Menu Bar Error: {error.message}</Alert>;

  const menuItems = [
    { text: 'Mis Reuniones', icon: <Bookmark /> },
    { text: 'Servicios Disponibles', icon: <Business /> },
    { text: 'Agregar Servicios', icon: <AddBusiness /> },
    { text: 'Home', icon: <Home /> },
    { text: 'Perfil', icon: <Person2 /> },
    { text: 'Logout', icon: <Logout /> }
  ];

  {/**if (data.user.isProfessional) {
    menuItems.splice(2, 0, { text: 'Agregar Servicios', icon: <AddBusiness /> });
  }**/}

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleListItemClick(item.text)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default MenuBar;