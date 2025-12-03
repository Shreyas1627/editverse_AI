import React, { useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import ChatMessage from '../AiChat/ChatMessage';

export default function RightSidebar({ messages, onSendMessage }) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendClick = () => {
    const message = inputRef.current?.value.trim();
    if (message) {
      onSendMessage(message);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContent}>
        <div style={styles.chatHeader}>
          <Sparkles size={18} style={{ color: '#3b82f6' }} />
          <span style={styles.chatHeaderTitle}>AI Assistant</span>
        </div>
        
        <div style={styles.chatMessages}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={styles.chatInputContainer}>
          <textarea
            ref={inputRef}
            style={styles.chatInput}
            placeholder="Ask me anything about editing..."
            rows={3}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.sendButton} onClick={handleSendClick}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '320px',
    background: '#18181b',
    borderLeft: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    padding: '16px',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  chatHeaderTitle: {
    color: '#e4e4e7',
    fontSize: '14px',
    fontWeight: '600',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chatInputContainer: {
    padding: '16px',
    borderTop: '1px solid #27272a',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#e4e4e7',
    fontSize: '13px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
};