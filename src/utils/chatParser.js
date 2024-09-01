export function parseChat(content, fileName) {
  const lines = content.split('\n');
  const messages = [];
  const chatName = fileName.replace('.txt', '').replace('WhatsApp Chat with ', '');

  const messageRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - ([^:]+): (.*)$/;
  const systemMessageRegex = /^(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}) - (.*)$/;

  for (const line of lines) {
    let match = line.match(messageRegex);
    if (match) {
      const [, timestamp, sender, content] = match;
      addMessage(messages, timestamp, sender, content);
    } else {
      match = line.match(systemMessageRegex);
      if (match) {
        const [, timestamp, content] = match;
        addMessage(messages, timestamp, 'System', content);
      }
    }
  }
  
  // Sort messages by date
  messages.sort((a, b) => a.date - b.date);

  return {
    name: chatName,
    messages,
    dateRange: getDateRange(messages),
    participants: getParticipants(messages),
    mostFrequentSender: identifyUser(messages)
  };
}

function addMessage(messages, timestamp, sender, content) {
  const date = parseDate(timestamp);
  messages.push({
    timestamp,
    date,
    sender,
    content,
    isOutgoing: false // We'll determine this later based on user input
  });
}

function parseDate(timestamp) {
  const [datePart, timePart] = timestamp.split(', ');
  const [day, month, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  return new Date(year, month - 1, day, hour, minute);
}

function getDateRange(messages) {
  if (messages.length === 0) return 'No messages';
  const firstDate = messages[0].date;
  const lastDate = messages[messages.length - 1].date;
  return `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getParticipants(messages) {
  return [...new Set(messages.map(message => message.sender))];
}

export function identifyUser(messages) {
  const senderFrequency = {};
  let maxFrequency = 0;
  let mostFrequentSender = '';

  messages.forEach(message => {
    if (!senderFrequency[message.sender]) {
      senderFrequency[message.sender] = 0;
    }
    senderFrequency[message.sender]++;

    if (senderFrequency[message.sender] > maxFrequency) {
      maxFrequency = senderFrequency[message.sender];
      mostFrequentSender = message.sender;
    }
  });

  return mostFrequentSender;
}

export function searchMessages(chat, searchTerm) {
  const lowercaseTerm = searchTerm.toLowerCase();
  return chat.messages.filter(message => 
    message.content.toLowerCase().includes(lowercaseTerm) ||
    message.sender.toLowerCase().includes(lowercaseTerm)
  );
}

export function setOutgoingMessages(chat, userName) {
  chat.messages.forEach(message => {
    message.isOutgoing = message.sender === userName;
  });
}
