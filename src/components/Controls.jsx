import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Controls.css';

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/png','image/jpeg','image/jpg','image/gif','image/webp'];

const Controls = ({ onSend, sender = 'alice', recipient = 'bob', chatId = 1, roomId }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);              // File object
  const [fileDataUrl, setFileDataUrl] = useState(null); // data:<mime>;base64,...
  const [encoding, setEncoding] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSignOut = () => navigate('/logout');

  const readFileAsDataURL = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const resetAttachment = () => {
    setFile(null);
    setFileDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    const hasImage = !!fileDataUrl;
    if (!hasImage && !trimmed) return;

    try {
      if (hasImage) {
        await sendCombinedImageMessage(fileDataUrl, trimmed);
        // Reset caption after sending image+caption
        setText('');
      } else if (trimmed) {
        await sendPlainText(trimmed);
      }
    } catch (err) {
      console.error('Error sending:', err);
      setError(err.message || 'Send failed');
    }
  };

  // Send one message that includes the image and optional caption using the confirmed endpoint
  const sendCombinedImageMessage = async (base64, caption) => {
    if (!roomId) throw new Error('roomId required to send image');
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const filename = file?.name;
    const contentType = file?.type || 'image/png';
    const endpoint = `/api/chat/${roomId}/image`;
    const payload = {
      sender,
      recipient,
      imageBase64: base64,
      filename,
      contentType,
      messageType: 'IMAGE',
      // Backend seemed to accept messageText; include only if caption present
      ...(caption ? { messageText: caption } : {}),
    };

    console.log('[Send Image+Caption Attempt]', endpoint, payload);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.warn('[Send Image+Caption Failed]', endpoint, res.status, txt);
      throw new Error(`Image send failed (${res.status})`);
    }
    let saved = null;
    try { saved = await res.json(); } catch (_) {}
    console.log('[Send Image+Caption Success]', endpoint, saved);
    onSend({
      id: saved?.messageId || Date.now(),
      messageId: saved?.messageId,
      isUser: true,
      sender,
      recipient,
      messageType: 'IMAGE',
      imageData: base64,
      imageBase64: base64,
      imageFilename: filename,
      imageContentType: contentType,
      messageText: caption || undefined,
      text: caption || undefined,
      timestamp: saved?.timestamp ? new Date(saved.timestamp) : new Date(),
    });
    resetAttachment();
    setError(null);
  };

  const sendPlainText = async (trimmed) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ sender, recipient, chatId, messageType: 'TEXT', messageText: trimmed, roomId }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    let saved = null;
    try { saved = await response.json(); } catch (_) {}
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
    setText('');
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      resetAttachment();
      return;
    }
    // Validation
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
      setError('Unsupported file type. Choose an image.');
      resetAttachment();
      return;
    }
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image too large (>${MAX_IMAGE_MB}MB).`);
      resetAttachment();
      return;
    }
    setError(null);
    setFile(f);
    setEncoding(true);
    try {
      const dataUrl = await readFileAsDataURL(f);
      setFileDataUrl(dataUrl);
    } catch (err) {
      console.error('File read error', err);
      setError('Failed to read image');
      resetAttachment();
    } finally {
      setEncoding(false);
    }
  };

  const canSend = (!!text.trim() || !!fileDataUrl) && !encoding;

  return (
    <div className="controls-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={fileDataUrl ? 'Add an optional caption' : 'Message'}
          rows={2}
          className="message-input"
          style={{
            flex: 1,
            borderRadius: '6px',
            padding: '8px',
            resize: 'none',
          }}
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
          {encoding ? (
            'Encoding...'
          ) : (
            <>
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
          <button
            className="attach-button"
            type="button"
            onClick={handleAttachClick}
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
              <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24l-9.19 9.19a1 1 0 01-1.41-1.41l8.49-8.49" />
            </svg>
            {file ? 'Change image' : 'Attach image'}
          </button>
          {file && (
            <button
              type="button"
              onClick={resetAttachment}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #e53935',
                background: 'white',
                color: '#e53935',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
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

      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#d32f2f' }}>{error}</div>
      )}

      {file && (
        <div style={{ marginTop: 8, fontSize: 14, color: '#111' }}>
          <strong>{file.name}</strong>{' '}
          ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
      {fileDataUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={fileDataUrl}
            alt={file?.name || 'preview'}
            style={{ maxHeight: 140, borderRadius: 8, maxWidth: '100%', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
};

export default Controls;
