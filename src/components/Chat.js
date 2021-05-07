import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Messages from "../components/Messages";
import Typography from "@material-ui/core/Typography";

let socket;
let typeTimeOut;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#ACD2ED",
    "&:focus": {
      outline: "1px solid rgba(255,255,255,1);",
    },
  },
  box: {
    height: "70.77vh",
    backgroundColor: "#fff",
    margin: theme.spacing(1),
    border: "0.5px grey solid",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
  },
  input: {
    width: "99.6%",
    border: "0.1px grey solid",
    backgroundColor: "#FFFFF2",
    fontSize: "2.1vh",
  },
  buttonLeft: {
    backgroundColor: "#FFFFF2",
    width: "86%",
    height: "15.3vh",
    marginLeft: theme.spacing(1.1),
    border: "0.5px grey solid",
    borderBottomLeftRadius: "0.5rem",
  },
  buttonLeftClicked: {
    background: "linear-gradient(1deg, #F6AE2D 30%, #FFAA5A 90%)",
    width: "86%",
    height: "15.3vh",
    marginLeft: theme.spacing(1.1),
    border: "0.5px grey solid",
    borderBottomLeftRadius: "0.5rem",
  },
  buttonRight: {
    backgroundColor: "#FFFFF2",
    width: "86%",
    height: "15.3vh",
    marginLeft: theme.spacing(1),
    border: "0.3px grey solid",
    borderBottomRightRadius: "0.5rem",
  },
  topButton: {
    display: "block",
    fontSize: "1.9vh",
    fontWeight: "bold",
  },
  botButton: {
    display: "block",
    fontSize: "1.9vh",
    fontWeight: "bold",
  },
}));

const Chat = ({ location }) => {
  const ENDPOINT = "localhost:4000";
  // const ENDPOINT = "https://kimoxapp.herokuapp.com";
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, addHistory] = useState([]);
  const [error, setError] = useState("");
  const [inQue, setQue] = useState(false);
  const [inChat, setChatStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [room, setRoom] = useState("");
  const [escStatus, setEscStatus] = useState(0);
  const [typingStatus, setTypingStatus] = useState(false);

  function joinQue() {
    //Join Queque and send the user chats history ids back to backend
    socket.emit("joinQue", (res) => {
      if (res.error) return console.log(res.error);
      if (res.user) {
        setQue(true);
        setMessages([
          { user: "root", message: "Looking for someone to match you with..." },
        ]);
        setCurrentUser(res.data.id);
      }
    });
  }

  function disconnect(event) {
    if (event) {
      event.preventDefault();
    }
    switch (escStatus) {
      case 0:
        setEscStatus(1);
        break;
      case 1:
        setEscStatus(2);
        // emit something to disconenct
        if (inChat) {
          socket.emit("chatDc", { room: room }, () => {});
          setChatStatus(false);
          setMessages([
            ...messages,
            { user: "root", message: "You have disconnected from chat." },
          ]);
        } else if (inQue) {
          socket.emit("queDc");
          setMessages([
            ...messages,
            { user: "root", message: "You have disconnected from que." },
          ]);
        }
        break;
      case 2:
        joinQue();
        setEscStatus(0);
        break;
      default:
        break;
    }
  }

  function onKeyPressed(e) {
    if (e.key === "Escape") {
      disconnect(e);
    }
  }

  function typingTimeout() {
    socket.emit("typing", { room: room, user: currentUser, status: false });
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    joinQue();

    // On component unmount disconnect socket
    return () => {
      socket.emit("queDc");
      socket.emit("chatDc", { room: room });
    };
  }, [ENDPOINT, location.pathname]);

  useEffect(() => {
    socket.on("roomKick", () => {
      if (room !== "") {
        setMessages((messages) => [
          ...messages,
          { user: "root", message: "Chat room is no longer available." },
        ]);
        setRoom("");
        setChatStatus(false);
        setEscStatus(2);
      }
    });
  }, [room]);

  useEffect(() => {
    // When matched with another user
    socket.on("matched", (user) => {
      setQue(false);
      setRoom(user.roomID);
      setMessages([
        {
          user: "root",
          message: "Matched with a stranger say Hi!",
        },
      ]);
      setChatStatus(true);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("setTyping", () => {
      setTypingStatus(true);
    });

    socket.on("stopTyping", () => {
      setTypingStatus(false);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit(
        "sendMessage",
        { message: message, room: room, user: currentUser },
        () => {
          socket.emit("typing", {
            room: room,
            user: currentUser,
            status: false,
          });
          setMessage("");
        }
      );
    }
  };

  return (
    <div
      className={classes.root}
      onKeyDown={(event) => onKeyPressed(event)}
      tabIndex={0}
    >
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <Box className={classes.box} justifyContent="space-around">
            <Messages
              messages={messages}
              name={currentUser}
              typing={typingStatus}
            />
          </Box>
        </Grid>

        <Grid item xs={4} md={1} lg={1}>
          <button
            onClick={(event) => disconnect(event)}
            className={
              escStatus === 0
                ? classes.buttonLeft
                : escStatus === 2
                ? classes.buttonLeftClicked
                : classes.buttonLeft
            }
            type="button"
          >
            <Typography className={classes.topButton}>
              {escStatus === 0
                ? "End Chat"
                : escStatus === 1
                ? "Really?"
                : escStatus === 2
                ? "New"
                : undefined}
            </Typography>
            <Typography className={classes.botButton}>(Esc)</Typography>
          </button>
        </Grid>
        <Grid item xs={4} md={10} lg={10}>
          <textarea
            disabled={
              inChat === false ? true : inChat === true ? false : undefined
            }
            className={classes.input}
            name="Chat"
            rows="6"
            value={message}
            onChange={(event) => {
              if (escStatus > 0) {
                setEscStatus(0);
              }
              socket.emit("typing", {
                room: room,
                user: currentUser,
                status: true,
              });
              clearTimeout(typeTimeOut);
              typeTimeOut = setTimeout(typingTimeout, 2000);
              setMessage(event.target.value);
            }}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : undefined
            }
          />
        </Grid>
        <Grid item xs={4} md={1} lg={1}>
          <button
            disabled={
              inChat === false ? true : inChat === true ? false : undefined
            }
            className={classes.buttonRight}
            type="button"
            onClick={(event) => sendMessage(event)}
          >
            <Typography className={classes.topButton}>Send</Typography>
            <Typography className={classes.botButton}>(Enter)</Typography>
          </button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
