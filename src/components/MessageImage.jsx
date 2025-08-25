import React from 'react';

// Renders an image for a message by resolving inline base64 or falling back to server URL.
// Props:
// - msg: { messageId, messageType, imageData, imageFilename, imageContentType }
// - roomId: string (for server fallback URL)
// - maxHeight?: number (optional, default 300)
// - className?: string
// - style?: React.CSSProperties
const MessageImage = ({ msg, roomId, maxHeight = 300, className, style }) => {
  if (!msg) return null;

  const guessMimeFromFilename = (filename) => {
    if (!filename) return 'image/jpeg';
    const ext = String(filename).toLowerCase().split('.').pop();
    switch (ext) {
      case 'png': return 'image/png';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'bmp': return 'image/bmp';
      case 'svg': return 'image/svg+xml';
      default: return 'image/jpeg';
    }
  };

  const looksLikeImageType =
    typeof msg.messageType === 'string' &&
    msg.messageType.toUpperCase().includes('IMAGE');

  // Build inline data URL when base64 is present
  let inlineSrc = null;
  if (msg.imageData) {
    const asString = String(msg.imageData);
    if (asString.startsWith('data:')) {
      inlineSrc = asString; // already a data URL
    } else {
      const ct = msg.imageContentType || guessMimeFromFilename(msg.imageFilename);
      inlineSrc = `data:${ct};base64,${asString}`;
    }
  }

  const hasImage = !!inlineSrc || !!msg.imageFilename || !!msg.imageData || looksLikeImageType;

  // Fallback to server URL that serves the image by messageId
  const serverImageSrc = !inlineSrc && hasImage && roomId
    ? `/api/chat/${roomId}/image/${msg.messageId}`
    : null;

  const src = inlineSrc || serverImageSrc;
  if (!src) return null;

  return (
    <div className={className || 'message-image'} style={{ marginTop: 8, ...(style || {}) }}>
      <img
        src={src}
        alt={msg.imageFilename || 'image'}
        style={{ maxWidth: '100%', maxHeight, borderRadius: 8, display: 'block' }}
      />
    </div>
  );
};

export default MessageImage;