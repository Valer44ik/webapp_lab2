import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/chatRoom';

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(""); // State to hold the username
  const [chatroom, setChatroom] = useState(""); // State to hold the chatroom name

  const joinChatRoom = async (usernameInput, chatroomInput) => {
    setUsername(usernameInput); // Save username
    setChatroom(chatroomInput); // Save chatroom

    try {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5085/chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("ReceiveMessage", (username, msg, timestamp) => {
        console.log(`Message received: ${username}: ${msg} at ${timestamp}`); // Debug log
        setMessages(messages => [...messages, { username, msg, timestamp }]); // Removed isNew flag for simplicity
      });

      conn.on("ShowTyping", (typingUsername) => {
        setTypingUsers(users => [...new Set([...users, typingUsername])]);
      });

      conn.on("HideTyping", (typingUsername) => {
        setTypingUsers(users => users.filter(user => user !== typingUsername));
      });

      conn.on("UpdateUserList", (userList) => {
        setUsers(Array.from(userList));
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", { username: usernameInput, chatroom: chatroomInput });

      setConnection(conn);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (msg) => {
    try {
        console.log(`Sending message: ${msg}`); // Debug log
        await conn.invoke("SendMessage", chatroom, msg); // Send chatroom and message separately
    } catch (e) {
        console.log(e);
    }
  };

  const handleTyping = (isTyping) => {
    if (isTyping) {
      conn.invoke("UserTyping", chatroom, username);
    } else {
      conn.invoke("UserStoppedTyping", chatroom, username);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row className='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>Welcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          {!conn
            ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
            : <ChatRoom
                messages={messages}
                typingUsers={typingUsers}
                users={users}
                sendMessage={sendMessage}
                handleTyping={handleTyping}
              />
          }
        </Container>
      </main>
    </div>
  );
}

export default App;
