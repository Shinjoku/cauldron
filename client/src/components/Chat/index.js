import React, { useState } from 'react';
import ws from 'socket.io-client';
import clsx from 'clsx';

import Icon from '../Icon';
import Button from '../Button';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import { Container } from './styles';

const socket = ws('http://localhost:8000');

socket.on('connect', () => {
  console.log("Connected");
});

socket.on('new message', data => {});
socket.on('disconnect', () => {
  console.log("Disconnected");
});

function Chat() {

  const [open, setOpen] = useState(true);
  const [messageList, setMessageList] = useState([]);

  const sendMessage = text => {
    // Send msg to server

    setMessageList([
      ...messageList, 
      {
        description: text,
        metadata: {
          author: { username: "You" }
        }
      }
    ]);
  };

  return (
    <Container>
      {
        !open && (
          <Button fab className="activator" onClick={() => setOpen(true)}>
            <Icon name="chatbubbles-outline" />
          </Button>
        )
      }
      <div className={clsx("chat-container", open && "open")}>
        <Button className="close-btn" onClick={() => setOpen(false)}>
          <Icon name="close-outline" />
        </Button>
        <div className="message-container">
          {messageList.map((msg, idx) => {
            let prevMsg;

            if (idx > 0)
              prevMsg = messageList[idx-1];

            return (
              <ChatMessage 
                key={"chat-message-"+idx}
                description={msg.description}
                metadata={msg.metadata}
                showAuthor={!prevMsg || prevMsg.metadata.author.username !== msg.metadata.author.username}
              />
            );
          })}
        </div>
        <ChatInput onMessage={sendMessage} />
      </div>
    </Container>
  );
}

export default Chat;