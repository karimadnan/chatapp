import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import Message from "./Message";

const Messages = ({ messages, name, typing }) => (
  <Scrollbars>
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} myName={name} />
      </div>
    ))}
    {typing && (
      <Message
        message={{ user: "root", message: "Stranger is typing..." }}
        myName={name}
      />
    )}
  </Scrollbars>
);

export default Messages;
