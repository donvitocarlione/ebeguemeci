import React from 'react';

function FileUpload({ onFileUpload }) {
  const handleFileSelect = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        // Use File System Access API
        const fileHandles = await window.showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: 'WhatsApp chat logs',
              accept: {
                'application/zip': ['.zip'],
                'text/plain': ['.txt']
              }
            }
          ]
        });
        onFileUpload(fileHandles);
      } else {
        // Fallback to traditional file input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.zip,.txt';
        input.onchange = async (event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            onFileUpload(Array.from(files));
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      onFileUpload([dirHandle]);
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFileSelect}>Choose files</button>
      <button onClick={handleFolderSelect}>Choose folder</button>
      <p>Please select WhatsApp chat log zip files, txt files, or a folder containing them</p>
    </div>
  );
}

export default FileUpload;
