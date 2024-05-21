import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  TextField,
  Grid,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Drawer,
  Fab,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

type User = {
  id: string;
  name: string;
};

type Message = {
  user: string;
  content: string;
};

export function Chat() {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [users, setUsers] = useState<User[]>([]);
  
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);


  // Esta parte no se si está correcto 
  useEffect(() => {
    // depende del back
    fetch('')
      .then(response => response.json())
      .then(data => setUsers(data as User[]));

    // Establecer la conexión de socket
    const newSocket: Socket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && selectedUser) {
      const message: Message = { user: selectedUser, content: newMessage };
      socket?.emit('private_message', { to: selectedUser, message });
      setNewMessage('');
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <ChatIcon />
      </Fab>
      <Drawer
        anchor="bottom"
        open={isChatOpen}
        onClose={toggleChat}
        PaperProps={{
          style: { height: '50%', top: '50%', transform: 'translateY(-50%)' }
        }}
      >
        <div className="Chat" style={{ padding: 20 }}>
          <Typography variant="h2">{isConnected ? 'Connected' : 'Disconnected'}</Typography>
          <FormControl fullWidth style={{ marginTop: 20 }}>
            <InputLabel id="select-user-label">Select User</InputLabel>
            <Select
              labelId="select-user-label"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value as string)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Paper style={{ padding: 20, marginTop: 20, marginBottom: 20, maxHeight: '70%', overflowY: 'auto' }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${msg.user}: ${msg.content}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                label="Message"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
                Enviar Mensaje
              </Button>
            </Grid>
          </Grid>
        </div>
      </Drawer>
    </>
  );
}