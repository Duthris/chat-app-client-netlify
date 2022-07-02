import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// Use socket to fetch request to data 
// Socket server's url and topic in which data is sent
const useSocket = (roomName) => {
    const [messages, setMessages] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const { userName } = useParams();
    const socket = useRef();

    useEffect(() => {
        socket.current = io("wss://duthris-chat-app.herokuapp.com", { transports: ['websocket'], upgrade: false, query: { roomName } })
        socket.current.userName = userName;

        socket.current.emit('join', { roomName, userName });

        socket.current.on('new-message', (message) => {
            const newMessage = { ...message, receivedUser: message.sentUser === socket.current.id }
            setMessages((messages) => [...messages, newMessage])
        });

        socket.current.emit('get-users', { roomName });

        socket.current.on('users', (users) => {
            setUsersList(users);
            users.forEach(user => {
                if (!usersList.includes(user)) usersList.push(user);
            })
        })

        return () => {
            socket.current.disconnect();
        }
    }, [roomName, socket]); // eslint-disable-line react-hooks/exhaustive-deps


    const sendNewMessage = (message) => {
        socket.current.emit('new-message', {
            message: message,
            sentUser: socket.current.id,
            userName: socket.current.userName
        });
    }

    return { messages, sendNewMessage, socket, usersList };
}

export default useSocket;
