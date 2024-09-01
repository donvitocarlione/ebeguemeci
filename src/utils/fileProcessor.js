import { unzip } from 'fflate';
import { parseChat } from './chatParser';
import { unzipAndProcess } from './unzip';

export async function processFolder(filesOrHandles) {
  console.log('Input to processFolder:', filesOrHandles);

  try {
    // If filesOrHandles is a single item, wrap it in an array
    const itemsToProcess = Array.isArray(filesOrHandles) ? filesOrHandles : [filesOrHandles];
    const chats = [];

    for (const item of itemsToProcess) {
      if (item instanceof File) {
        // Handle File objects
        if (item.name.endsWith('.zip')) {
          const zipChats = await processZipFile(item);
          chats.push(...zipChats);
        } else if (item.name.endsWith('.txt')) {
          const content = await readFileAsText(item);
          const parsedChat = parseChat(content, item.name);
          chats.push(parsedChat);
        } else {
          console.warn(`Skipping unsupported file: ${item.name}`);
        }
      } else if (typeof item.getFile === 'function') {
        // Handle FileSystemFileHandle objects
        const file = await item.getFile();
        if (file.name.endsWith('.zip')) {
          const zipChats = await processZipFile(file);
          chats.push(...zipChats);
        } else if (file.name.endsWith('.txt')) {
          const content = await readFileAsText(file);
          const parsedChat = parseChat(content, file.name);
          chats.push(parsedChat);
        } else {
          console.warn(`Skipping unsupported file: ${file.name}`);
        }
      } else if (typeof item.values === 'function') {
        // Handle FileSystemDirectoryHandle objects
        for await (const entry of item.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            if (file.name.endsWith('.zip')) {
              const zipChats = await processZipFile(file);
              chats.push(...zipChats);
            } else if (file.name.endsWith('.txt')) {
              const content = await readFileAsText(file);
              const parsedChat = parseChat(content, file.name);
              chats.push(parsedChat);
            } else {
              console.warn(`Skipping unsupported file: ${file.name}`);
            }
          }
        }
      } else {
        console.warn(`Unsupported item type: ${item}`);
      }
    }

    return chats;
  } catch (error) {
    console.error('Error in processFolder:', error);
    throw error;
  }
}

function processZipFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const zipBuffer = e.target.result;
      unzip(new Uint8Array(zipBuffer), (err, unzipped) => {
        if (err) {
          reject(err);
        } else {
          const chats = Object.entries(unzipped)
            .filter(([name]) => name.endsWith('.txt'))
            .map(([name, content]) => {
              const textDecoder = new TextDecoder('utf-8');
              const textContent = textDecoder.decode(content);
              return parseChat(textContent, name);
            });
          resolve(chats);
        }
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
