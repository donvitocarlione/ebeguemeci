import JSZip from 'jszip';
import { parseChat } from './chatParser';

export async function unzipAndProcess(fileOrFolder) {
  const extractedChats = [];
  const mediaFiles = [];

  console.log('Input type:', typeof fileOrFolder, fileOrFolder);

  if (fileOrFolder instanceof File) {
    if (fileOrFolder.name.endsWith('.zip')) {
      // Handle zip file
      const zip = new JSZip();
      const contents = await zip.loadAsync(fileOrFolder);
      
      for (const [fileName, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async('string');
          if (fileName === 'messages') {
            const parsedChat = parseChat(content, 'WhatsApp Chat');
            extractedChats.push(parsedChat);
          } else if (fileName.startsWith('IMG-') || fileName.startsWith('PTT-') || fileName.startsWith('VID-')) {
            const blob = await zipEntry.async('blob');
            mediaFiles.push({
              name: fileName,
              type: getFileType(fileName),
              url: URL.createObjectURL(blob)
            });
          }
        }
      }
    } else {
      // Handle single file
      const content = await readTextFile(fileOrFolder);
      const parsedChat = parseChat(content, fileOrFolder.name);
      extractedChats.push(parsedChat);
    }
  } else if (Array.isArray(fileOrFolder)) {
    // Handle array of files
    for (const file of fileOrFolder) {
      if (file instanceof File) {
        if (file.name === 'messages') {
          const content = await readTextFile(file);
          const parsedChat = parseChat(content, 'WhatsApp Chat');
          extractedChats.push(parsedChat);
        } else if (file.name.startsWith('IMG-') || file.name.startsWith('PTT-') || file.name.startsWith('VID-')) {
          mediaFiles.push({
            name: file.name,
            type: getFileType(file.name),
            url: URL.createObjectURL(file)
          });
        }
      }
    }
  } else if (fileOrFolder && typeof fileOrFolder.getFile === 'function') {
    // Handle FileSystemDirectoryHandle
    const files = await readFolder(fileOrFolder);
    for (const file of files) {
      if (file.name === 'messages') {
        const content = await readTextFile(file);
        const parsedChat = parseChat(content, 'WhatsApp Chat');
        extractedChats.push(parsedChat);
      } else if (file.name.startsWith('IMG-') || file.name.startsWith('PTT-') || file.name.startsWith('VID-')) {
        mediaFiles.push({
          name: file.name,
          type: getFileType(file.name),
          url: URL.createObjectURL(file)
        });
      }
    }
  } else {
    throw new Error(`Unsupported input type: ${typeof fileOrFolder}`);
  }

  // Add media files to the chat
  if (extractedChats.length > 0) {
    extractedChats[0].media = mediaFiles;
  }

  return extractedChats;
}

// ... rest of the code remains the same


function getFileType(fileName) {
  if (fileName.startsWith('IMG-')) return 'image';
  if (fileName.startsWith('PTT-')) return 'audio';
  if (fileName.startsWith('VID-')) return 'video';
  return 'unknown';
}

async function readFolder(folder) {
  if (folder.getFile) {
    // FileSystemDirectoryHandle
    const files = [];
    for await (const entry of folder.values()) {
      if (entry.kind === 'file') {
        files.push(await entry.getFile());
      }
    }
    return files;
  } else {
    // Fallback for when folder is actually an array of File objects
    return folder;
  }
}

async function readTextFile(file) {
  if (file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else {
    // For FileSystemFileHandle
    const fileData = await file.getFile();
    return fileData.text();
  }
}
