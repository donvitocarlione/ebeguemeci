import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import WordCloud from './WordCloud';

function ChatAnalytics({ analytics }) {
  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const { messageCounts, activeHours, wordFrequency, wordCloudData } = analytics;

  const messageCountData = Object.entries(messageCounts || {}).map(([name, count]) => ({ name, count }));
  const activeHoursData = (activeHours || []).map((count, hour) => ({ hour, count }));

  return (
    <div className="chat-analytics">
      <h2>Chat Analytics</h2>
      
      <h3>Message Counts by Sender</h3>
      {messageCountData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={messageCountData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No message count data available</p>
      )}

      <h3>Active Hours</h3>
      {activeHoursData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activeHoursData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No active hours data available</p>
      )}

      <h3>Word Cloud</h3>
      {wordCloudData && wordCloudData.length > 0 ? (
        <WordCloud words={wordCloudData} />
      ) : (
        <p>No word cloud data available</p>
      )}

      <h3>Top 10 Words</h3>
      {wordFrequency && wordFrequency.length > 0 ? (
        <ul>
          {wordFrequency.map(([word, count], index) => (
            <li key={index}>{word}: {count}</li>
          ))}
        </ul>
      ) : (
        <p>No word frequency data available</p>
      )}
    </div>
  );
}

export default ChatAnalytics;
