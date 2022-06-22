import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './App.css'
// const host = "http://localhost:3000";
const URL = 'http://localhost:8080/hello';

function App() {
  // const [mess, setMess] = useState([]);
  // const [message, setMessage] = useState('');
  // const [id, setId] = useState();

  // const [user, setUser] = useState('Tarzan');
    const [stompClient, setStompClient] = useState(null);
  	const [message, setMessage] = useState([]);
  	const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('vinhdeptrai');

  // const socketRef = useRef();
  const messagesEnd = useRef();

  // useEffect(() => {
  //   socketRef.current = socketIOClient.connect(host)
  
  //   socketRef.current.on('getId', data => {
  //     setId(data)
  //   })

  //   socketRef.current.on('sendDataServer', dataGot => {
  //     setMess(oldMsgs => [...oldMsgs, dataGot.data])
  //     scrollToBottom()
  //   })

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, []);

  const submitMessage = () => {
    // const messageObj = { user: user, message: message };
    // ws.send(JSON.stringify(messageObj));
    // setMessages([...messages, message]);
    stompClient.send("/app/hello/"+user, {}, {message});
  }

  useEffect(() => {
    const socket = SockJS(URL);
    const stompClients = Stomp.over(socket);
    stompClients.connect({}, () => {
      stompClients.subscribe('/topic/messages/' + user, (data) => {
        setMessages(data);
      });
    });
    setStompClient(stompClients);
    // ws.opopen = () => {
    //   console.log('connected')
    // }

    // ws.onmessage = (e) => {
    //   const messageobs = JSON.parse(e.data);
    //   setMessages([...messages, messageobs]);
    //   // scrollToBottom();
    // }

    // return () => {
    //   ws.onclose = () => {
    //     console.log('WebSocket Disconnected');
    //     setWs(new WebSocket(URL));
    //   }
    // }
  }, []);

  // const sendMessage = () => {
  //   if(message !== null) {
  //     const msg = {
  //       content: message, 
  //       id: id
  //     }
  //     socketRef.current.emit('sendDataClient', msg)
  //     setMessage('')
  //   }
  // }

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }
  

  const renderMess =  messages.map((m, index) => 
        <div key={index}>
          {m.message}
        </div>
      )
      // ${m.user === user ? 'your-message' : 'other-people'} chat-item
  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      submitMessage()
    }
  }

  return (
    <>
    <div>
    <label htmlFor="user">
	          Name :
	          <input
	            type="text"
	            id="user"
	            placeholder="User"
	            value={user}
	            onChange={(e) => setUser(e.target.value)}
	          />
	        </label>
    </div>
    <div class="box-chat">
      <div class="box-chat_message">
      <p>{messages}</p>
      <p>{message}</p>
      <div style={{ float:"left", clear: "both" }}
             ref={messagesEnd}>
        </div>
      </div>

      <div class="send-box">
          <textarea 
            value={message}
            // onKeyDown={onEnterPress}
            onChange={handleChange} 
            placeholder="Nhập tin nhắn ..." 
          />
          <button onClick={submitMessage}>
            Send
          </button>
      </div>

    </div>
    </>
  );
}

export default App;