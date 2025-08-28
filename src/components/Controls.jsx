import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Controls.css';

// if an image is attached -> send image 

const Controls = ({ onSend, sender = 'alice', recipient = 'bob', chatId = 1, roomId }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);      // File
  const [attachmentBase64, setAttachmentBase64] = useState(null); // data:base64
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE = 'https://fs-dev.portnov.com';  //'http://localhost:5173'

  const handleSignOut = () => navigate('/logout');

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setAttachment(null);
      setAttachmentBase64(null);
      return;
    }
    setAttachment(f);
    try {
      const b64 = await toBase64(f); // already has data: prefix
      setAttachmentBase64(b64);
    } catch (err) {
      console.error('Read file error', err);
      setAttachment(null);
      setAttachmentBase64(null);
    }
  };

  const reset = () => {
    setText('');
    setAttachment(null);
    setAttachmentBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (sending) return;
    const trimmed = text.trim();
    if (!trimmed && !attachmentBase64) return;
    setSending(true);
    try {
      if (attachmentBase64) {
        // IMAGE message
        if (!roomId) {
          throw new Error('roomId required for image upload');
        }
        const imagePayload = {
          sender,
          recipient,
          imageBase64: attachmentBase64,
          filename: attachment?.name,
          contentType: attachment?.type || 'image/png',
          messageType: 'IMAGE',
          ...(trimmed ? { messageText: trimmed } : {}), // optional caption
        };
        const resp = await fetch(`${API_BASE}/api/chat/${roomId}/image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imagePayload),
        });
        if (!resp.ok) throw new Error('Failed to send image');
        let saved = null; try { saved = await resp.json(); } catch (_) {}
        onSend({
          id: saved?.messageId || Date.now(),
          messageId: saved?.messageId,
          isUser: true,
          sender,
          recipient,
          messageType: 'IMAGE',
          imageData: attachmentBase64,
          imageBase64: attachmentBase64,
          imageFilename: attachment?.name,
          imageContentType: attachment?.type,
          text: trimmed || undefined,
          messageText: trimmed || undefined,
          timestamp: saved?.timestamp ? new Date(saved.timestamp) : new Date(),
        });
      } else if (trimmed) {
        // TEXT message
        const textPayload = {
          sender,
          recipient,
          chatId,
          messageType: 'TEXT',
          messageText: trimmed,
        };
        const resp = await fetch(`${API_BASE}/api/messages/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(textPayload),
        });
        if (!resp.ok) throw new Error('Failed to send message');
        let saved = null; try { saved = await resp.json(); } catch (_) {}
        onSend({
          id: saved?.messageId || Date.now(),
          messageId: saved?.messageId,
          text: trimmed,
          messageText: trimmed,
          isUser: true,
          sender,
          recipient,
          messageType: 'TEXT',
          timestamp: saved?.timestamp ? new Date(saved.timestamp) : new Date(),
        });
      }
      reset();
    } catch (err) {
      console.error('Error sending:', err);
    } finally {
      setSending(false);
    }
  };

  const canSend = !!attachmentBase64 || !!text.trim();

  return (
    <div className="controls-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={attachmentBase64 ? 'Optional caption' : 'Message'}
          rows={2}
          className="message-input"
          style={{ flex: 1, borderRadius: '6px', padding: '8px', resize: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="send-button"
          style={{
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: canSend ? 'pointer' : 'not-allowed',
            gap: '6px',
          }}
        >
          {sending ? 'Sending...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="#7bb928" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send
            </>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="attach-button" type="button" onClick={handleAttachClick} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #7bb928', color: '#111', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="#7bb928" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24l-9.19 9.19a1 1 0 01-1.41-1.41l8.49-8.49" />
            </svg>
            {attachment ? 'Change image' : 'Attach image'}
          </button>
          {attachment && (
            <button type="button" onClick={reset} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e53935', background: 'white', color: '#e53935', cursor: 'pointer' }}>
              Remove
            </button>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <button
          className="signout-button"
          onClick={handleSignOut}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #7bb928',
            color: '#111',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7bb928"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 17l5-5-5-5M21 12H9M13 5V7a7 7 0 0 1 0 10v2" />
          </svg>
          Sign out
        </button>
     </div>

      {attachment && (
        <div style={{ marginTop: 8, fontSize: 14, color: '#111' }}>
          <strong>{attachment.name}</strong> ({(attachment.size / 1024).toFixed(1)} KB)
        </div>
      )}
      {attachmentBase64 && (
        <div style={{ marginTop: 8 }}>
          <img src={attachmentBase64} alt={attachment?.name || 'preview'} style={{ maxHeight: 140, borderRadius: 8, maxWidth: '100%', display: 'block' }} />
        </div>
      )}
    </div>
  );
};

export default Controls;
