import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, CssBaseline } from '@mui/material';
import { Business, AddBusiness, Logout} from '@mui/icons-material';
import Home from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const drawerWidth = 240;

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleListItemClick = (text: string) => {
    if (text === 'Business') {
      navigate('/services');
    } else if (text === 'Add Business') {
      navigate('/create-job');
    } else if (text === 'Logout') {
      logout();
      navigate('/');
    }else if(text==='Home'){
      navigate('/home');
    }
  };

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
          {['Business', 'Add Business', 'Home', 'Logout'].map((text, index) => (
            <ListItem button key={text} onClick={() => handleListItemClick(text)}>
              <ListItemIcon>
                {text === 'Business' && <Business />}
                {text === 'Add Business' && <AddBusiness />}
                {text === 'Logout' && <Logout />}
                {text === 'Home' && <Home/>}  
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default MenuBar;

