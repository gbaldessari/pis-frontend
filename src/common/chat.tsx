import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { io, Socket } from "socket.io-client";
import { GET_USERS, GET_USER } from "../graphql/users.graphql";
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
  Box
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

type User = {
  id: string;
  username: string;
};

type Message = {
  user: string;
  content: string;
};

export function Chat() {
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(GET_USERS);
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dataUsers && dataUsers.users) {
      setUsers(dataUsers.users);
    }
  }, [dataUsers]);

  useEffect(() => {
    if (dataUser && dataUser.user) {
      setCurrentUser(dataUser.user.data);
    }
  }, [dataUser]);

  useEffect(() => {
    const newSocket: Socket = io('http://localhost:81', {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    // Unirse a la sala global al conectar
    newSocket.emit('event-join', 'global_chat');

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && currentUser) {
      const message: Message = { user: currentUser.username, content: newMessage };
      // Enviar el mensaje al servidor y esperar confirmación antes de actualizar localmente
      socket?.emit('event-message', { room: 'global_chat', message: newMessage, user: currentUser.username }, (response: any) => {
        // La respuesta del servidor confirma que el mensaje ha sido enviado correctamente
        if (response.success) {
          setNewMessage('');
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
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
        anchor="right"
        open={isChatOpen}
        onClose={toggleChat}
        PaperProps={{
          style: { width: '38%' }
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box flexGrow={1} p={2} display="flex" flexDirection="column">
            <Typography variant="h6">{isConnected ? 'Conectado' : 'Desconectado'}</Typography>
            <FormControl fullWidth style={{ marginTop: 20 }}>
              <InputLabel id="select-user-label">Seleccionar Usuario</InputLabel>
              <Select
                labelId="select-user-label"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value as string)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Paper style={{ flexGrow: 1, padding: 20, marginTop: 20, overflowY: 'auto' }}>
              <List>
                {messages.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${msg.user}: ${msg.content}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          <Box p={2} borderTop="1px solid #ccc">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  label="Mensaje"
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}