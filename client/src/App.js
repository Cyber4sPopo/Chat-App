import React, { useState, useEffect, useRef}from "react";
import axios from "axios";
import "./App.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function App() {
  const [user, setUser] = useState();
  const [chat, setChat] = useState([]);
  const [messageInput, setMessageInput] = useState();


  useEffect(() => {
    setUser('Guest#' + getRandomInt(2000));
    setInterval(async () => {
        const { data } = await axios.get("/messages");
        console.log(data);
        setChat(data);
      }, 1500);
  }, []);

  const addMessage = async (e) => {
    e.preventDefault();
    await axios.post("/messages",{
      message: messageInput,
      user
    });
    setMessageInput("");  
  }

  return (
    <div className="App">
      <div>
        <form onSubmit={addMessage}>
          <input
            id='messageInput'
            value={messageInput}
            onChange={e => {setMessageInput(e.target.value)}}
            type="name"
            placeholder="send a message"
          ></input>
          <button id='sendButton' type='submit'>Send</button>
        </form>
      </div>
      <div className="messagesContainer"> <div className="messageContainer">
        Name: {user}
        {chat.map((message) => <div className={message.user === user ? 'green msg' : 'red msg'}>{`${message.user}: \n ${message.message}`}</div>)}
      </div>
      </div>
    </div>
  );
}

export default App;
