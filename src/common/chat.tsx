import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { io, Socket } from "socket.io-client";
import { GET_USERS } from "../graphql/users.graphql";
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
  const { loading, error, data } = useQuery(GET_USERS);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // ver si necesito friltar solo por profesionales
  useEffect(() => { 
    if (data && data.users) {
      setUsers(data.users);
    }
  }, [data]);

  useEffect(() => {
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

  // COMENTADOS PARA PODER VER LO VISUAL 
  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error.message}</p>;

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
            <Typography variant="h5">{isConnected ? 'Connected' : 'Disconnected'}</Typography>
            <FormControl fullWidth style={{ marginTop: 20 }}>
              <InputLabel id="select-user-label">Select User</InputLabel>
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
                  label="Message"
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