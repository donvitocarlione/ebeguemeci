import JSZip from 'jszip';
import { parseChat } from './chatParser';

self.addEventListener('message', async (e) => {
  const file = e.data;
  try {
    const chats = await processZipFile(file);
    self.postMessage({ type: 'success', chats });
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message });
  }
});

async function processZipFile(file) {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const chats = [];

  for (const [filename, zipEntry] of Object.entries(contents.files)) {
    if (!zipEntry.dir && filename.endsWith('.txt')) {
      const content = await zipEntry.async('string');
      const parsedChat = parseChat(content, filename);
      chats.push(parsedChat);
    }
  }

  return chats;
}
