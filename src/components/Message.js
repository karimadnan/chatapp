import React from "react";

import Typography from "@material-ui/core/Typography";
// import ReactEmoji from "react-emoji";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  myName: {
    display: "inline-block",
    fontSize: "2.9vh",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "blue",
  },
  hisName: {
    display: "inline-block",
    fontSize: "2.9vh",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "red",
  },
  sysMessages: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: "inline-block",
    fontSize: "2.7vh",
    fontWeight: "bold",
    color: "#545050",
  },
  messages: {
    display: "inline-block",
    fontSize: "2.7vh",
    fontWeight: "bold",
    color: "#545050",
  },
}));

const Message = ({ message, myName }) => {
  let isSentByCurrentUser = false;
  const classes = useStyles();

  if (myName === message.user) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div>
      <Typography className={classes.myName}>{`You:`}</Typography>
      <Typography className={classes.messages}>{message.message}</Typography>
    </div>
  ) : message.user === "root" ? (
    <Typography className={classes.sysMessages}>{message.message}</Typography>
  ) : !isSentByCurrentUser ? (
    <div>
      <Typography className={classes.hisName}>{`Stranger:`}</Typography>
      <Typography className={classes.messages}>{message.message}</Typography>
    </div>
  ) : undefined;
};

export default Message;
