import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div style={{
      ...styles.message,
      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
    }}>
      <div style={{
        ...styles.messageContainer,
        background: isAssistant ? '#27272a' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      }}>
        <div style={styles.messageHeader}>
          <div style={styles.avatar}>
            {isAssistant ? <Bot size={14} /> : <User size={14} />}
          </div>
          <div style={styles.roleName}>
            {isAssistant ? 'AI Assistant' : 'You'}
          </div>
        </div>
        <div style={styles.messageContent}>{message.content}</div>
      </div>
    </div>
  );
}

const styles = {
  message: {
    maxWidth: '85%',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    borderRadius: '12px',
    padding: '12px 14px',
    color: '#e4e4e7',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  avatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleName: {
    fontSize: '12px',
    opacity: 0.9,
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
};