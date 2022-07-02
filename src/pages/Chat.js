import React from 'react';
import useSocket from '../hooks/useSocket';
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import Popover from '@mui/material/Popover';

const useStyles = makeStyles(() => ({
    root: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        margin: '16px',
    },

    box: {
        wordWrap: "break-word",
        color: '#fff',
        backgroundColor: '#282a36',
        m: 1,
        p: 1,
        borderRadius: 25,
        fontSize: '2rem',
        fontWeight: '400',
        width: 'auto',
        maxWidth: '100%',
        overflow: 'auto',
        textAlign: 'center',
        margin: 'auto',
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #31a24c',
        boxShadow: '0px 0px 5px #31a24c',
        fontFamily: '"Roboto", sans-serif',
    },

    chatContainer: {
        flex: 1,
        minHeight: 100,
        overflow: 'auto',
        border: '1px solid green',
        boxShadow: '0px 0px 5px #31a24c',
        maxWidth: '100%',
        borderRadius: 25,
        backgroundColor: '#282a36',
        marginBottom: '10px',
    },

    textField: {
        width: '100%',
        margin: '10px',
        borderRadius: 25,
    },

    input: {
        color: '#282a36',
        fontSize: '1.5rem',
        fontWeight: '400',
    },

    messages: {
        margin: "8px",
        padding: "12px 8px",
        wordBreak: "break-word",
        color: "white",
        borderRadius: "20px",
    },

    sentMessage: {
        backgroundColor: "rgb(0, 132, 255)",
        marginLeft: "auto",
    },

    receivedMessage: {
        backgroundColor: "#31a24c",
        marginRight: "auto",
    },

    senderChip: {
        margin: "10px",
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: '800',
        fontFamily: '"Roboto", sans-serif',
    },

    receiverChip: {
        margin: '10px',
        backgroundColor: '#282a36',
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: '400',
        borderRadius: 25,
        padding: '10px',
        fontFamily: '"Roboto", sans-serif',
    },
}));



const Chat = () => {
    const classes = useStyles();
    const { roomName } = useParams();
    const { messages, sendNewMessage, usersList } = useSocket(roomName);
    const [message, setMessage] = useState("");

    const linksEndRef = useRef(null);

    const endOfDiv = () => {
        linksEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSendNewMessage = () => {
        sendNewMessage(message);
        setMessage("");
    }

    const navigateToHomePage = () => {
        window.location.href = "/";
    }

    React.useEffect(() => {
        endOfDiv();
    }, [messages])

    React.useEffect(() => {
        document.title = `Chat - ${roomName}`;
    }, [roomName]);


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);



    return (
        <div className={classes.root}>
            <Button
                onClick={navigateToHomePage}
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                size="large"
                sx={{ width: '10%', borderRadius: 25 }}
            > Leave Chat
            </Button>

            <Box
                className={classes.box}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <ForumIcon fontSize='large' />
                <Typography>{roomName}</Typography>
                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                        
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    {usersList.map((user, index) => {
                        return (
                            <Typography key={index} sx={{ p: 1 }}>{user}</Typography>
                        )
                    })}
                </Popover>
            </Box>

            <List style={{ maxHeight: '100%', overflow: 'auto' }} />
            <Container
                className={classes.chatContainer}
                maxWidth='100%'
            >
                {messages.map((message, i) => (
                    <Grid key={i}>
                        {!message.receivedUser && (
                            <Chip
                                avatar={
                                    <Avatar>
                                        <Typography sx={{ wordBreak: 'break-word' }}>
                                            {message.userName.charAt(0).toUpperCase()}
                                        </Typography>
                                    </Avatar>
                                }
                                label={message.userName}
                                variant="filled"
                                color={message.receivedUser ? "primary" : "success"}
                                className={message.receivedUser ? classes.senderChip : classes.receiverChip}
                                size="medium"
                            />
                        )}

                        <Box
                            className={`${classes.messages} ${message.receivedUser ? classes.sentMessage : classes.receivedMessage}`}
                            sx={{ maxWidth: '40%', wordBreak: 'break-word', width: `${message.message.length}%` }}
                        ><Typography>{message.message}</Typography>
                        </Box>
                    </Grid>
                ))}

                <div ref={linksEndRef}></div>

            </Container>

            <TextField
                id="filled-multiline-flexible"
                label="Message"
                placeholder="Write something..."
                multiline
                size="medium"
                className={classes.textField}
                value={message}
                rows={4}
                onChange={handleMessageChange}
                variant="outlined"
                color="success"
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim() !== "") {
                        handleSendNewMessage();
                    }
                }}
                InputProps={{ className: classes.input }}
            >
            </TextField>

            <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ width: '100%', margin: '10px', right: 9 }}
                startIcon={<SendIcon />}
                onClick={handleSendNewMessage}
                disabled={message.trim() === ""}
            > Send
            </Button>
        </div>
    )
}

export default Chat