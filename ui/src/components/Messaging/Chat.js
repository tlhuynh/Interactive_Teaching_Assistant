import React, { useContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

import { QuizContext } from "../ActivityCreation/QuizContext";
import { ChatContext } from "./ChatContext";
import ChatBox from "./ChatBox";
import ChatDrawer from "./ChatDrawer";

let apiUrl = "";
let ENDPOINT = "";
if (process.env.REACT_APP_DEPLOY === "False") {
  apiUrl = `http://localhost:8080`;
  ENDPOINT = `http://localhost:7000/`;
} else {
  apiUrl = `${process.env.REACT_APP_EC2HOST}:8080`;
  ENDPOINT = `${process.env.REACT_APP_EC2HOST}:7000/`;
}

const Chat = ({ user, sessionName, sessionId }) => {
  const [value, setValue] = useState("");
  const { messages, setMessages } = useContext(ChatContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  let socket = socketIOClient(ENDPOINT + sessionName);
  let sockid = "";

  useEffect(() => {
    axios
      .post(apiUrl + "/chat/join", { sessionName: sessionName })
      .then(function (res) {
        if (res.data.chat_created === true) {
          socket.on("connect", function () {
            sockid = socket.id;
          });
          listen();
          socket.emit("get messages", sockid);
        } else {
          console.log("chat listener creation error");
        }
      });
  }, []);

  useEffect(() => {
    updateMessages = (data) => {
      setMessages(data);
    };
  }, [messages]);

  const listen = () => {
    socket.on("chat message from server", function (data) {
      // console.log('DATA: ', data)
      // console.log('Incoming message for : ' + sockid +  ' ' + data[0]+ ' ' + data[1]);
      //Update messages state
      updateMessages(data);
    });
    socket.on("initial messages", function (data) {
      // console.log('DATA: ', data)
      // console.log('Incoming message for : ' + sockid +  ' ' + data[0]+ ' ' + data[1]);
      //Update messages state
      updateMessages(data);
    });
  };

  let updateMessages = (data) => {
    console.log("The first definition");
    let newMessages = [...messages];
    newMessages.push(data);
    setMessages(newMessages);
    // console.log(newMessages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('submitting: ', value);
    socket.emit("chat message from client", { msg: value, user: user });
    setValue("");

    //Clear text box here
  };

  return (
    <>
      <ChatDrawer
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={value}
        messages={messages}
        user={user}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        updateMessages={updateMessages}
      />

      {/* <h1>CHAT</h1>
        <form onSubmit={e => handleSubmit(e)}>
        <label>
          Name:
          <input type="text" value={value} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        {messages.map((msg)=> (
          <p>{msg}</p>
        ))}
      </div> */}
    </>
  );
};

export default Chat;
