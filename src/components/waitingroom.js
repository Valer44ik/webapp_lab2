import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState('');
  const [chatroom, setChatroom] = useState('');

  const handleJoin = () => {
    if (username && chatroom) {
      joinChatRoom(username, chatroom);
    }
  };

  return (
    <div className="waiting-room">
      <h2>Join a Chat Room</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter chat room name"
        value={chatroom}
        onChange={(e) => setChatroom(e.target.value)}
      />
      <Button onClick={handleJoin} disabled={!username || !chatroom}>
        Join
      </Button>
    </div>
  );
};

export default WaitingRoom;
