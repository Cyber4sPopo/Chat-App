import React, { useState, useEffect, useRef}from "react";
import axios from "axios";
import "./App.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function App() {
  const [id, setId] = useState();
  const [chat, setChat] = useState([]);
  const [messageInput, setMessageInput] = useState();


  useEffect(() => {
    setId(getRandomInt(2000));
    setInterval(async () => {
        const { data } = await axios.get("/messages");
        console.log(data);
        setChat(data);
      }, 200);
  }, []);

  async function addMessage() {
    await axios.post("/messages",{
      message: messageInput,
      id
    });  
  }


  return (
    <div className="App">
      <div>
        <input
          onChange={e => {setMessageInput(e.target.value)}}
          type="name"
          placeholder="send a message"
        ></input>
        <button onClick={addMessage}>click me</button>
      </div>
      <div className="messageContainer">
        {chat.map((message) => <div className={message.id === id ? 'green' : 'red'}>{message.message}</div>)}
      </div>
    </div>
  );
}

export default App;
