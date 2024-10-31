import React from 'react';

const MessageContainer = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <div key={index}>
                    <strong>{msg.username}</strong>: {msg.msg} <em>{msg.timestamp}</em>
                </div>
            ))}
        </div>
    );
};

export default MessageContainer;