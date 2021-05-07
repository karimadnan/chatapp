import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  onlineCount: {
    marginRight: theme.spacing(2),
    marginLeft: "auto",
    color: "#F46036",
    fontWeight: "bold",
  },
  title: {
    flexGrow: 1,
  },
  appName: {
    fontWeight: "bold",
    color: "#F46036",
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const [online, setOnline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:4000/online")
        .then(function (response) {
          if (response.data.data) {
            setOnline(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FFFFF2" }}>
        <Toolbar>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h4"
              className={classes.appName}
            // className={classes.title}
            >
              My App
            </Typography>
          </Link>
          <Typography variant="h5" className={classes.onlineCount}>
            <NumberFormat
              value={online + 2000}
              displayType={"text"}
              thousandSeparator={true}
            />
            + Online
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
