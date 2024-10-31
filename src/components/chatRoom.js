import { Row, Col } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import "./chatRoom.css"

const ChatRoom = ({ messages, typingUsers, users, sendMessage, handleTyping }) => {
  return (
    <div>
      <Row className="px-5 py-5">
        <Col sm={8}>
          <h2>Chat Room</h2>
          <div>
            <strong>Currently Typing:</strong>{" "}
            {typingUsers.length > 0
              ? typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.join(", ")} are typing...`
              : "No one is typing."}
          </div>
        </Col>
        <Col sm={4}>
          <h5>Users in this chat:</h5>
          <ul>{users.map(user => <li key={user}>{user}</li>)}</ul>
        </Col>
      </Row>
      <Row className="px-5 py-5">
        <Col sm={12}>
          <MessageContainer messages={messages} />
        </Col>
        <Col sm={12}>
          <SendMessageForm sendMessage={sendMessage} handleTyping={handleTyping} />
        </Col>
      </Row>
    </div>
  );
};

export default ChatRoom;
