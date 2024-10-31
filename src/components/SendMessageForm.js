import { Button } from "react-bootstrap";
import { useState, useEffect } from "react"
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";

const SendMessageForm = ({ sendMessage, handleTyping, username }) => {
    const [msg, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
        handleTyping(e.target.value.length > 0); // Pass only isTyping state
    };

    return (
      <Form onSubmit={e => {
        e.preventDefault();
        sendMessage(msg);
        setMessage('');
        handleTyping(false); // Notify that user stopped typing
      }}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Chat</InputGroup.Text>
          <Form.Control onChange={handleChange} value={msg} placeholder="Type a message"></Form.Control>
          <Button variant="primary" type="submit" disabled={!msg}>Send</Button>
        </InputGroup>
      </Form>
    );
};

export default SendMessageForm;
