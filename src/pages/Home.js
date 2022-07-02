import React from "react";
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/core/';
import useSocket from "../hooks/useSocket";

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: '50%',
        transform: 'translate(0, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const Home = () => {
    const classes = useStyles();
    const [roomName, setRoomName] = React.useState("");
    const [userName, setUserName] = React.useState("");

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    }

    const handleSubmit = () => {
        if (roomName && userName) {
            window.location.href = `/room=${roomName}/user=${userName}`;
        }
    }

    const { usersList } = useSocket(roomName);

    return (
        <div className={classes.root}>
            <TextField
                id="filled-multiline-flexible"
                label="Room Name"
                multiline
                required
                size="medium"
                sx={{ width: '30%', margin: '10px' }}
                value={roomName}
                error={roomName.length < 3}
                helperText={roomName.length < 3 ? "Room name must be at least 3 characters long" : ""}
                onChange={handleRoomNameChange}
                variant="filled"
                placeholder="Room"
                color="success"
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && roomName && userName && !usersList.includes(userName)) {
                        handleSubmit();
                    }
                }}
            />

            <TextField
                id="filled-multiline-flexible"
                label="User Name"
                multiline
                required
                size="medium"
                sx={{ width: '30%', margin: '10px' }}
                value={userName}
                error={userName.length < 3 || usersList.includes(userName)}
                helperText={usersList.includes(userName) ? "User name already taken" : userName.length < 3 ? "User name must be at least 3 characters long" : ""}
                onChange={handleUserNameChange}
                variant="filled"
                placeholder="User"
                color="success"
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && roomName && userName && !usersList.includes(userName)) {
                        handleSubmit();
                    }
                }}
            />

            <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ width: '20%', margin: '10px' }}
                startIcon={<ChatIcon />}
                disabled={userName.length < 3 || roomName.length < 3 || usersList.includes(userName)}
                onClick={handleSubmit}
            > Join Chat
            </Button>
        </div>
    );
};

export default Home;