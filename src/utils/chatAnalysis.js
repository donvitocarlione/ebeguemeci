export function analyzeChat(chat) {
  if (!chat || !chat.messages || chat.messages.length === 0) {
    return null;
  }

  const messageCounts = getMessageCountsBySender(chat);
  const activeHours = getActiveHours(chat);
  const { wordFrequency, wordCloudData } = getWordData(chat);
  const messageCountByDate = getMessageCountByDate(chat);
  const averageMessageLength = getAverageMessageLength(chat);

  return {
    messageCounts,
    activeHours,
    wordFrequency,
    wordCloudData,
    messageCountByDate,
    averageMessageLength,
    totalMessages: chat.messages.length,
    totalParticipants: Object.keys(messageCounts).length,
    dateRange: getDateRange(chat)
  };
}

function getMessageCountsBySender(chat) {
  const counts = {};
  chat.messages.forEach(message => {
    counts[message.sender] = (counts[message.sender] || 0) + 1;
  });
  return counts;
}

function getActiveHours(chat) {
  const hours = Array(24).fill(0);
  chat.messages.forEach(message => {
    const hour = new Date(message.timestamp).getHours();
    hours[hour]++;
  });
  return hours;
}

function getWordData(chat) {
  const words = {};
  chat.messages.forEach(message => {
    message.content.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3) {  // Ignore short words
        words[word] = (words[word] || 0) + 1;
      }
    });
  });

  const sortedWords = Object.entries(words).sort((a, b) => b[1] - a[1]);

  return {
    wordFrequency: sortedWords.slice(0, 10),  // Return top 10 words
    wordCloudData: sortedWords.slice(0, 100).map(([text, value]) => ({ text, value }))  // Return top 100 words
  };
}

function getMessageCountByDate(chat) {
  const counts = {};
  chat.messages.forEach(message => {
    const date = new Date(message.timestamp).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

function getAverageMessageLength(chat) {
  const totalLength = chat.messages.reduce((sum, message) => sum + message.content.length, 0);
  return totalLength / chat.messages.length;
}

function getDateRange(chat) {
  const dates = chat.messages.map(message => new Date(message.timestamp));
  const minDate = new Date(Math.min.apply(null, dates));
  const maxDate = new Date(Math.max.apply(null, dates));
  return {
    start: minDate.toISOString().split('T')[0],
    end: maxDate.toISOString().split('T')[0]
  };
}
