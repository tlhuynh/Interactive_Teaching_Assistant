import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplyIcon from "@material-ui/icons/Reply";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import { makeStyles } from "@material-ui/core/styles";

import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    borderRadius: 6,
    padding: 15,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  form: {
    padding: 5,
    paddingBottom: 15,
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  h1: {
    textAlign: "center",
  },
  messageRight: {
    background: "#1982FC",
    borderRadius: "10px",
    margin: "10px",
    maxWidth: "60%",
    float: "right",
    // minWidth: "40%",
  },
  messageLeft: {
    background: "#d3d3d3",
    borderRadius: "10px",
    maxWidth: "60%",
    minWidth: "40%",
    margin: "10px",
  },
  replyRightMe: {
    background: "#1982FC",
    borderRadius: "10px",
    margin: "10px",
    marginTop: "5px",
    // marginRight: "5px",
    maxWidth: "50%",
    float: "right",
    // minWidth: "40%",
  },
  replyRightThem: {
    background: "#d3d3d3",
    borderRadius: "10px",
    margin: "10px",
    marginTop: "5px",
    // marginRight: "5px",
    maxWidth: "50%",
    float: "right",
    // minWidth: "40%",
  },
  replyLeftMe: {
    background: "#1982FC",
    borderRadius: "10px",
    maxWidth: "50%",
    minWidth: "40%",
    margin: "10px",
    marginTop: "5px",
    // marginLeft: "5px",
    float: "left",
  },
  replyLeftThem: {
    background: "#d3d3d3",
    borderRadius: "10px",
    maxWidth: "50%",
    minWidth: "40%",
    margin: "10px",
    marginTop: "5px",
    // marginLeft: "5px",
    float: "left",
  },
  replyIconLeft: {
    // transform: "scaleX(-1)",
    transform: "scaleY(-1)",
    // color: "red",
  },
  replyIconRight: {
    // transform: "scaleX(-1)",
    transform: "scale(-1,-1)",
    // color: "black",
  },
}));

const ChatBox = ({
  handleSubmit,
  handleChange,
  value,
  messages,
  user,
  handleReply,
  myMessages,
  isOriginal,
  setIsOriginal,
  replyToMessage_ID,
  setReplyToMessage_ID,
}) => {
  const formatDate = (date) => {
    return (
      // (date.getUTCMonth() + 1).toString() +
      // "/" +
      // date.getUTCDate() +
      // "/" +
      // date.getUTCFullYear().toString() +
      // " " +
      date.getUTCHours() + ":" + ("0" + date.getMinutes()).substr(-2)
      //  +
      // ":" +
      // date.getUTCSeconds()
    );
  };
  const classes = useStyles();
  const replyStyleHandler = (isMe, replyTo) => {
    if (replyTo !== null) {
      // true === right, false === left
      // console.log(myMessages);
      // console.log(replyTo);
      const right = myMessages.some((msgid) => msgid === replyTo);
      if (isMe) {
        if (right) {
          return classes.replyRightMe;
        } else {
          return classes.replyLeftMe;
        }
      } else {
        if (right) {
          return classes.replyRightThem;
        } else {
          return classes.replyLeftThem;
        }
      }
    } else {
      if (isMe) {
        return classes.messageRight;
      } else {
        return classes.messageLeft;
      }
    }
  };

  const handleMessageTypeChange = (msgid) => {
    if (isOriginal === true) {
      setIsOriginal(!isOriginal);
    }
    setReplyToMessage_ID(msgid);

    console.log("handleMessageMSGID", msgid);
  };

  const renderReplyButton = (replyto, msgid, isMe) =>
    replyto === null ? (
      <IconButton onClick={() => handleMessageTypeChange(msgid)}>
        <ReplyIcon
          className={
            isMe === true ? classes.replyIconRight : classes.replyIconLeft
          }
        />
      </IconButton>
    ) : null;

  const handleReplyOrSubmit = (e) => {
    if (isOriginal === true) {
      handleSubmit(e);
    } else {
      handleReply(e, replyToMessage_ID);
    }
  };

  return (
    <>
      <div className={classes.root} style={chatContainer}>
        {/*<h1>Chat</h1>*/}
        {/*<div style={{ overflowY: "scroll" }}>*/}
        <div style={chatListStyle}>
          <List dense={true} style={{ overflow: "scroll" }}>
            {messages.map((msg) => {
              if (msg.user.id === user.User_ID) {
                return (
                  <>
                    <ListItem
                      className={replyStyleHandler(true, msg.replyTo)}
                      align="right"
                      key={msg.Message_ID}
                    >
                      {renderReplyButton(msg.replyTo, msg.Message_ID, true)}
                      <Grid container>
                        <Grid item xs={12}>
                          <ListItemText
                            align="right"
                            primary={msg.Message_Content}
                            // secondary={msg.user.firstName}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ListItemText
                            align="right"
                            secondary={
                              formatDate(new Date(msg.createdAt)) + " UTC"
                            }
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  </>
                );
              } else {
                return (
                  <>
                    <ListItem
                      key={msg.Message_ID}
                      className={replyStyleHandler(false, msg.replyTo)}
                    >
                      <ListItemIcon>
                        <Avatar>
                          {msg.user.firstName.charAt(0) +
                            msg.user.lastName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>

                      <Grid container>
                        <Grid item xs={12}>
                          <ListItemText
                            align="left"
                            primary={msg.Message_Content}
                            // secondary={
                            //   msg.user.firstName + " " + msg.user.lastName
                            // }
                          >

                          </ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                          <ListItemText
                            align="left"
                            secondary={
                              `- ${msg.user.firstName}` +
                              ` ${msg.user.lastName}, ` +
                              formatDate(new Date(msg.createdAt)) +
                              " UTC"
                            }
                          >

                          </ListItemText>
                        </Grid>
                      </Grid>
                      {renderReplyButton(msg.replyTo, msg.Message_ID, false)}
                    </ListItem>
                  </>
                );
              }
            })}
          </List>
        </div>
        <div style={inputDivContainer}>
          <form
            className={classes.form}
            onSubmit={(e) => handleReplyOrSubmit(e)}
            style={inputFormContainer}
          >
            <FormControl margin="normal" style={chatInputStyle}>
              <InputLabel htmlFor="message"></InputLabel>
              <Input
                id="message"
                placeholder={
                  isOriginal === true
                    ? "Send something nice"
                    : "Reply with something nice"
                }
                // onBlur="Send something nice!"
                name="message"
                value={value}
                onChange={handleChange}
                autoFocus
                autoComplete="off"
                size="normal"
              />
            </FormControl>
            <Button
              type="submit"
              // fullWidth
              variant="contained"
              // color="primary"
              onClick={(e) => handleReplyOrSubmit(e)}
              style={sendButtonStyle}
            >
              {isOriginal === true ? "Send Message" : "Send Reply"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

const chatContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
}

const chatListStyle = {
  overflow: "scroll",
  height: '90%',
};


const inputDivContainer = {
  borderTop: "2px solid lightgray",
};

const inputFormContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const chatInputStyle = {
  width: "79%",
  margin: "10px",
};

const sendButtonStyle = {
  width: "19%",
  margin: "10px",
};

export default ChatBox;
