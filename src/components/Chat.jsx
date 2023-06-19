// Chat.jsx

import React, { useState, useEffect } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from server on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch('/api/messages');
    const messages = await response.json();
    setMessages(messages);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const message = { content: newMessage, timestamp: new Date() };
    setMessages([...messages, message]);
    setNewMessage('');

    // Call the server-side route
    const response = await fetch(`/api/completions?prompt=${encodeURIComponent(newMessage)}`);
    const data = await response.json();

    const botMessage = { content: data.choices[0].text, timestamp: new Date() };
    setMessages((messages) => [...messages, botMessage]);
  };

  return (
    <div>
      <div>
        {messages.map((message, i) => (
          <div key={i}>{message.content}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default Chat;
