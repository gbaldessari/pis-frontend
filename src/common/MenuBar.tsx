import React from 'react';
import { useQuery } from '@apollo/client';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, CssBaseline, CircularProgress, Alert } from '@mui/material';
import { Business, AddBusiness, Logout, Bookmark, Person2, Home, ModeCommentOutlined, AddComment, Storage, MilitaryTech } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GET_USER } from '../graphql/users.graphql';

const drawerWidth = 240;

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_USER);

  const handleListItemClick = (text: string) => {
    switch (text) {
      case 'Servicios Disponibles':
        navigate('/services');
        break;
      case 'Agregar Servicios':
        navigate('/create-job');
        break;
      case 'Logout':
        Cookies.remove('token');
        window.location.reload();
        navigate('/login');
        break;
      case 'Home':
        navigate('/home');
        break;
      case 'Mis Reuniones':
        navigate('/userMeets');
        break;
      case 'Comentarios':
        navigate('/review');
        break;
      case 'Hacer Comentario':
        navigate('/create-review');
        break;
      case 'Mis Servicios':
        navigate('/profMeets');
        break;
      case 'Perfil':
        navigate('/profile');
        break;
      case 'Top5':
        navigate('/favorite_job');
        break;
      default:
        break;
    }
  };

  
  if (loading) return <CircularProgress />;
  

  if (error) return <Alert severity="error">Menu Bar Error: {error.message}</Alert>;

  const menuItems = [
    { text: 'Mis Reuniones', icon: <Bookmark /> },
    { text: 'Servicios Disponibles', icon: <Business /> },
    { text: 'Home', icon: <Home /> },
    { text: 'Perfil', icon: <Person2 /> },
    { text: 'Comentarios', icon: <ModeCommentOutlined /> },
    { text: 'Hacer Comentario', icon: <AddComment /> },
  ];

  if (data.user.data.isProfessional) {
    menuItems.push(
      { text: 'Mis Servicios', icon: <Storage /> },
      { text: 'Agregar Servicios', icon: <AddBusiness /> },
      { text: 'Top5', icon: <MilitaryTech /> }
    );
  }

 
  menuItems.push({ text: 'Logout', icon: <Logout /> });

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
