import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AI anything..."
        style={styles.input}
      />
      <button type="submit" style={styles.sendButton} disabled={!message.trim()}>
        <Send size={18} />
      </button>
    </form>
  );
}

const styles = {
  container: {
    padding: '16px',
    borderTop: '1px solid #27272a',
    display: 'flex',
    gap: '8px',
    background: '#0f0f14',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #27272a',
    background: '#18181b',
    color: '#e4e4e7',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
};