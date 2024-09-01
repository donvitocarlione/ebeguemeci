import React from 'react';

function MediaRenderer({ file }) {
  switch (file.type) {
    case 'image':
      return <img src={file.url} alt={file.name} />;
    case 'audio':
      return <audio controls src={file.url} />;
    case 'video':
      return <video controls src={file.url} />;
    default:
      return <p>Unsupported file type: {file.name}</p>;
  }
}

export default MediaRenderer;
